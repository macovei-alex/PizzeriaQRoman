package ro.pizzeriaq.qservices.data.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orderitem_optionlist_option")
public class OrderItem_OptionList_Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToOne
    @JoinColumn(name = "id_orderitem", nullable = false)
    private OrderItem orderItem;


    @ManyToOne
    @JoinColumn(name = "id_optionlist_option", nullable = false)
    private OptionList_Option optionListOption;


    @Column(nullable = false)
    private int count;
}
