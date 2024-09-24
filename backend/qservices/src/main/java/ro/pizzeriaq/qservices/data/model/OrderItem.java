package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orderitem")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "id_order", nullable = false)
    private Order order;


    @ManyToOne
    @JoinColumn(name = "id_product", nullable = false)
    private Product product;


    @OneToMany(mappedBy = "orderItem")
    private List<OrderItem_OptionList_Option> options;


    @Column(nullable = false)
    private int totalPrice;


    @Column(nullable = false)
    private int totalPriceWithDiscount;


    @Column(nullable = false)
    private int count;
}
