package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.TestEntity;
import ro.pizzeriaq.qservices.data.repository.TestEntityRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TestEntityService implements UtilsService {

    private final TestEntityRepository testEntityRepository;

    public TestEntityService(TestEntityRepository testEntityRepository) {
        this.testEntityRepository = testEntityRepository;
    }


    @Transactional(readOnly = true)
    public Optional<TestEntity> findById(int id) {
        var test = testEntityRepository.findById(id);
        if (test.isEmpty()) {
            return test;
        }
         for(var test2 : test.get().getTestEntity2s()) {
            fakeConsumer(test2);
        }
        return test;
    }


    @Transactional(readOnly = true)
    public List<TestEntity> findALl() {
        var tests = testEntityRepository.findAll();
        for (var test : tests) {
            for (var test2 : test.getTestEntity2s()) {
                fakeConsumer(test2);
            }
        }
        return tests;
    }


    public void save(TestEntity entity) {
        testEntityRepository.save(entity);
    }


    public void delete(TestEntity entity) {
        testEntityRepository.delete(entity);
    }
}
