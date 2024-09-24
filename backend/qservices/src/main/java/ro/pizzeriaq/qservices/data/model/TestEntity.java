package ro.pizzeriaq.qservices.data.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Getter
@Setter
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


    @OneToMany(mappedBy = "testEntity", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<TestEntity2> testEntity2s;


    private String text;


    private boolean active = true;


    @PreRemove
    private void preRemove() {
        System.out.println("TestEntity::preRemove");
        this.active = false;
    }


    @Override
    public String toString() {
        return String.format("TestEntity(id=%d, testEntity2s=%s text='%s', active=%b)",
                id, testEntity2s, text, active);
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TestEntity other = (TestEntity) o;

        boolean result = id.equals(other.id)
                && text.equals(other.text)
                && active == other.active;
        for (int i = 0; i < testEntity2s.size(); i++) {
            result = result && testEntity2s.get(i).equals(other.testEntity2s.get(i));
        }
        return result;
    }
}
