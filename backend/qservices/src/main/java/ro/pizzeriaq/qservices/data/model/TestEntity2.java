package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@SQLDelete(sql = "UPDATE test_entity SET active = false WHERE id = ?")
@SQLRestriction(value = "active = true")
public class TestEntity2 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_test_entity")
    private TestEntity testEntity;


    private String text;


    private boolean active = true;


    @PreRemove
    private void preRemove() {
        System.out.println("TestEntity2::preRemove");
        this.active = false;
    }
}
