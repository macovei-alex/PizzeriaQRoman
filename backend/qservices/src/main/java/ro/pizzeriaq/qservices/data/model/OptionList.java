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
@Table(name = "optionlist")
public class OptionList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @ManyToMany
    @JoinTable(
            name = "product_optionlist",
            joinColumns = @JoinColumn(name = "id_optionlist"),
            inverseJoinColumns = @JoinColumn(name = "id_product")
    )
    private List<Product> products;


    @OneToMany(mappedBy = "optionlist")
    private List<OptionList_Option> optionlistOptions;


    @Column(nullable = false)
    private int minChoices;


    @Column(nullable = false)
    private int maxChoices;
}
