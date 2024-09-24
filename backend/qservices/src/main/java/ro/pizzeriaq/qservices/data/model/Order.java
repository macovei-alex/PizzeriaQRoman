package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "id_account", nullable = false)
    private Account account;


    @ManyToOne
    @JoinColumn(name = "id_coupon", nullable = false)
    private Coupon coupon;


    @ManyToOne
    @JoinColumn(name = "id_orderstatus", nullable = false)
    private OrderStatus orderStatus;


    @OneToMany(mappedBy = "order")
    private List<OrderItem> orderItems;


    @Column(nullable = false, columnDefinition = "DATETIME")
    @ColumnDefault("NOW()")
    private LocalDateTime orderTimestamp = LocalDateTime.now();


    @Column(columnDefinition = "DATETIME")
    private LocalDateTime deliveryTimestamp;


    private Integer estimatedPreparationTime;


    @Column(length = 1000)
    private String additionalNotes;


    @Column(precision = 8, scale = 2)
    private BigDecimal totalPrice;


    @Column(precision = 8, scale = 2)
    private BigDecimal totalPriceWithDiscount;
}
