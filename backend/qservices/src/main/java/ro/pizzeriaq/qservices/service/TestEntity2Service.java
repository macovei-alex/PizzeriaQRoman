package ro.pizzeriaq.qservices.service;

import org.springframework.stereotype.Service;
import ro.pizzeriaq.qservices.data.model.TestEntity2;
import ro.pizzeriaq.qservices.data.repository.TestEntity2Repository;

@Service
public class TestEntity2Service {

	private final TestEntity2Repository testEntity2Repository;

	public TestEntity2Service(TestEntity2Repository testEntity2Repository) {
		this.testEntity2Repository = testEntity2Repository;
	}


	public void save(TestEntity2 entity) {
		testEntity2Repository.save(entity);
	}


	public void delete(TestEntity2 entity) {
		testEntity2Repository.delete(entity);
	}
}
