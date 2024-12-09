package ro.pizzeriaq.qservices.service;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.Option;
import ro.pizzeriaq.qservices.data.model.OptionList;
import ro.pizzeriaq.qservices.data.model.Product;
import ro.pizzeriaq.qservices.data.model.ProductCategory;
import ro.pizzeriaq.qservices.data.repository.OptionListRepository;
import ro.pizzeriaq.qservices.data.repository.OptionRepository;
import ro.pizzeriaq.qservices.data.repository.ProductCategoryRepository;
import ro.pizzeriaq.qservices.data.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class EntityInitializerService {
	ProductRepository productRepository;
	ProductCategoryRepository categoryRepository;
	OptionListRepository optionListRepository;
	OptionRepository optionRepository;


	public EntityInitializerService(ProductRepository productRepository,
									ProductCategoryRepository categoryRepository,
									OptionListRepository optionListRepository,
									OptionRepository optionRepository) {
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
		this.optionListRepository = optionListRepository;
		this.optionRepository = optionRepository;
	}


	@Transactional
	public void deleteAll() {
		System.out.println("EntityInitializerService.deleteAll()");

		productRepository.deleteAll();
		categoryRepository.deleteAll();
		optionListRepository.deleteAll();
		optionRepository.deleteAll();

		productRepository.flush();
		categoryRepository.flush();
		optionListRepository.flush();
		optionRepository.flush();
	}


	@Transactional
	public void addProducts() {
		System.out.println("EntityInitializerService.addProducts()");

		List<ProductCategory> categories = new ArrayList<>();
		categories.add(new ProductCategory(null, new ArrayList<>(), "Cele mai vandute mai vandute"));
		categories.add(new ProductCategory(null, new ArrayList<>(), "Pizza 1+1 combo"));
		categories.add(new ProductCategory(null, new ArrayList<>(), "Pizza 30 cm"));
		categories.add(new ProductCategory(null, new ArrayList<>(), "Fa-ti singur pizza"));
		categories.add(new ProductCategory(null, new ArrayList<>(), "Bauturi non-alcoolice"));

		categories = categoryRepository.saveAll(categories);

		List<Product> products = new ArrayList<>();
		products.add(new Product(null, categories.get(0), new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "Pizza Taraneasca", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(30.0), "", true));
		products.add(new Product(null, categories.get(0), new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "Pizza Margherita", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(40.0), "", true));
		products.add(new Product(null, categories.get(0), new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "Pizza Quattro Stagioni", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(50.0), "", true));
		products.add(new Product(null, categories.get(1), new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "Pizza Capriciosa", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(60.0), "", true));
		products.add(new Product(null, categories.get(1), new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "Pizza Quattro Formaggi", "1+1 Gratis la alegere", "500g", BigDecimal.valueOf(70.0), "", true));

		products = productRepository.saveAll(products);
	}


	@Transactional
	public void addOptionLists() {
		System.out.println("EntityInitializerService.addOptionLists()");

		List<OptionList> optionLists = new ArrayList<>();
		optionLists.add(new OptionList(null, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "Prima Pizza cu Margine Umpluta cu Branza Ricotta?", 1, 1, true));
		optionLists.add(new OptionList(null, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "Alege a Doua Pizza", 1, 1, true));
		optionLists.add(new OptionList(null, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "A Doua Pizza cu Margine Umpluta cu Branza Ricotta", 1, 1, true));
		optionLists.add(new OptionList(null, new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), "Doresti sos?", 0, 4, true));

		optionLists = optionListRepository.saveAll(optionLists);

		List<Option> options1 = new ArrayList<>();
		options1.add(new Option(null, List.of(), "cu branza Ricotta", "", BigDecimal.valueOf(8.0), 1, 1));
		options1.add(new Option(null, List.of(), "fara branza Ricotta", "", BigDecimal.valueOf(0.0), 1, 1));

		optionLists.get(0).getOptions().addAll(options1);
		optionLists.get(2).getOptions().addAll(options1);
		options1 = optionRepository.saveAll(options1);

		List<Option> options2 = new ArrayList<>();
		options2.add(new Option(null, List.of(), "Margherita", "", BigDecimal.valueOf(30.0), 1, 1));
		options2.add(new Option(null, List.of(), "Capriciosa", "", BigDecimal.valueOf(40.0), 1, 1));
		options2.add(new Option(null, List.of(), "Prosciutto e Funghi", "", BigDecimal.valueOf(50.0), 1, 1));
		options2.add(new Option(null, List.of(), "Quattro Stagioni", "", BigDecimal.valueOf(60.0), 1, 1));

		optionLists.get(1).getOptions().addAll(options2);
		options2 = optionRepository.saveAll(options2);

		List<Option> options3 = new ArrayList<>();
		options3.add(new Option(null, null, "Sos dulce", "", BigDecimal.valueOf(0.0), 0, 4));
		options3.add(new Option(null, null, "Sos Picant", "", BigDecimal.valueOf(0.0), 0, 4));
		options3.add(new Option(null, null, "Maioneza", "", BigDecimal.valueOf(0.0), 0, 4));
		options3.add(new Option(null, null, "Maioneza cu usturoi", "", BigDecimal.valueOf(0.0), 0, 4));

		optionLists.get(3).getOptions().addAll(options3);
		options3 = optionRepository.saveAll(options3);
	}


	@Transactional
	public void bindOptionsToProducts() {
		System.out.println("EntityInitializerService.bindOptionsToProducts()");

		List<Product> products = productRepository.findAll();
		List<OptionList> optionLists = optionListRepository.findAll();

		products.get(0).getOptionLists().add(optionLists.get(0));
		products.get(0).getOptionLists().add(optionLists.get(1));
		products.get(0).getOptionLists().add(optionLists.get(3));
		productRepository.save(products.get(0));
	}
}
