package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.Objects;

@Getter
@Setter
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


    @Override
    public String toString() {
        return String.format("TestEntity2(id=%d, text='%s', active=%b)", id, text, active);
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TestEntity2 other = (TestEntity2) o;

        return id.equals(other.id)
                && text.equals(other.text)
                && active == other.active
                && testEntity.getId().equals(other.testEntity.getId());
    }

}
