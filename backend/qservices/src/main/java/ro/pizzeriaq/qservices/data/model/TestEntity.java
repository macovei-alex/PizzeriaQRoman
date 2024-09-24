package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@SQLDelete(sql = "UPDATE test_entity SET active = false WHERE id = ?")
@SQLRestriction(value = "active = true")
public class TestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @OneToMany(mappedBy = "testEntity")
    private List<TestEntity2> testEntity2s;


    private String text;


    private boolean active = true;


    @PreRemove
    private void preRemove() {
        System.out.println("TestEntity::preRemove");
        this.active = false;
    }
}
