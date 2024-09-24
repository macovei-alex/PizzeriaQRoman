package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "options")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @OneToMany(mappedBy = "option")
    private List<OptionList_Option> optionListOptions;


    @Column(nullable = false, length = 60)
    private String name;


    @Column(precision = 8, scale = 2, nullable = false)
    private BigDecimal description;


    @Column(nullable = false)
    private int minCount;


    @Column(nullable = false)
    private int maxCount;
}
