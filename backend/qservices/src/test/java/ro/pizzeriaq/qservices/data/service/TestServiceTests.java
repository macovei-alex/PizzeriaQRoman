package ro.pizzeriaq.qservices.data.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ro.pizzeriaq.qservices.data.model.TestEntity;
import ro.pizzeriaq.qservices.data.model.TestEntity2;
import ro.pizzeriaq.qservices.service.TestEntity2Service;
import ro.pizzeriaq.qservices.service.TestEntityService;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
public class TestServiceTests {

    private final TestEntityService testEntityService;
    private final TestEntity2Service testEntity2Service;

    @Autowired
    public TestServiceTests(TestEntityService testEntityService, TestEntity2Service testEntity2Service) {
        this.testEntityService = testEntityService;
        this.testEntity2Service = testEntity2Service;
    }

    @Test
    public void saveCascade() {
        var sent = new TestEntity(null, new ArrayList<>(), "test text", true);
        var child1 = new TestEntity2(null, sent, "test text 2", true);
        sent.getTestEntity2s().add(child1);
        var child2 = new TestEntity2(null, sent, "test text 3", true);
        sent.getTestEntity2s().add(child2);

        testEntityService.save(sent);

        var received = testEntityService.findById(sent.getId()).orElseThrow();
        assertEquals(sent, received, "sent and received are not equal");
    }


    @Test
    public void deleteCascade() {
        var toDelete = testEntityService.findALl().getFirst();
        testEntityService.delete(toDelete);

        var received = testEntityService.findById(toDelete.getId()).orElse(null);
        assertNull(received, "received is not null");
    }
}
