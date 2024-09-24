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
public class AddressType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @OneToMany(mappedBy = "addressType")
    private List<Address> addresses;


    @Column(nullable = false, unique = true, length = 30)
    private String name;
}
