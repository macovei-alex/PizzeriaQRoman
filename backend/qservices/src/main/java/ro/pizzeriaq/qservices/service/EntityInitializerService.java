package ro.pizzeriaq.qservices.service;


import org.springframework.data.domain.Sort;
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
		List<ProductCategory> categories = new ArrayList<>();

		categories.add(ProductCategory.builder().name("Cele mai vandute mai vandute").build());
		categories.add(ProductCategory.builder().name("Pizza 1+1 combo").build());
		categories.add(ProductCategory.builder().name("Pizza 30 cm").build());
		categories.add(ProductCategory.builder().name("Fa-ti singur pizza").build());
		categories.add(ProductCategory.builder().name("Bauturi non-alcoolice").build());

		categories = categoryRepository.saveAll(categories);

		List<Product> products = new ArrayList<>();

		products.add(Product.builder()
				.category(categories.get(0))
				.name("Pizza Capriciosa")
				.subtitle("1+1 Gratis la alegere")
				.description("Ingrediente: sos, salam, cabanos, ciuperci, măsline, mozzarella, roșii, ardei - 550g")
				.price(BigDecimal.valueOf(30.0))
				.build());

		products.add(Product.builder()
				.category(categories.get(0))
				.name("Pizza Quattro Formaggi")
				.subtitle("1+1 Gratis la alegere")
				.description("500g")
				.price(BigDecimal.valueOf(35.0))
						.isActive(true)
				.build());

		products.add(Product.builder()
				.category(categories.get(0))
				.name("Pizza Quattro Stagioni")
				.subtitle("1+1 Gratis la alegere")
				.description("500g")
				.price(BigDecimal.valueOf(40.0))
				.isActive(true)
				.build());

		products.add(Product.builder()
				.category(categories.get(1))
				.name("Pizza Margherita")
				.subtitle("1+1 Gratis la alegere")
				.description("500g")
				.price(BigDecimal.valueOf(30.0))
				.isActive(true)
				.build());

		products.add(Product.builder()
				.category(categories.get(1))
				.name("Pizza Taraneasca")
				.subtitle("1+1 Gratis la alegere")
				.description("500g")
				.price(BigDecimal.valueOf(30.0))
				.isActive(true)
				.build());

		productRepository.saveAll(products);
	}


	@Transactional
	public void addOptionLists() {
		List<OptionList> optionLists = new ArrayList<>();

		optionLists.add(OptionList.builder()
				.options(new ArrayList<>())
				.text("Prima Pizza cu Margine Umpluta cu Branza Ricotta?")
				.minChoices(1)
				.maxChoices(1)
				.isActive(true)
				.build());

		optionLists.add(OptionList.builder()
				.options(new ArrayList<>())
				.text("Alege a Doua Pizza")
				.minChoices(1)
				.maxChoices(1)
				.isActive(true)
				.build());

		optionLists.add(OptionList.builder()
				.options(new ArrayList<>())
				.text("A Doua Pizza cu Margine Umpluta cu Branza Ricotta")
				.minChoices(1)
				.maxChoices(1)
				.isActive(true)
				.build());

		optionLists.add(OptionList.builder()
				.options(new ArrayList<>())
				.text("Doresti sos?")
				.minChoices(0)
				.maxChoices(4)
				.isActive(true)
				.build());

		optionLists = optionListRepository.saveAll(optionLists);

		List<Option> options1 = new ArrayList<>();
		options1.add(Option.builder()
				.name("cu branza Ricotta")
				.price(BigDecimal.valueOf(8.0))
				.minCount(1)
				.maxCount(1)
				.build());

		options1.add(Option.builder()
				.name("fara branza Ricotta")
				.price(BigDecimal.valueOf(0.0))
				.minCount(1)
				.maxCount(1)
				.build());

		optionLists.get(0).getOptions().addAll(options1);
		optionLists.get(2).getOptions().addAll(options1);
		optionRepository.saveAll(options1);

		List<Option> options2 = new ArrayList<>();

		options2.add(Option.builder()
				.name("Margherita")
				.price(BigDecimal.valueOf(30.0))
				.minCount(1)
				.maxCount(1)
				.build());

		options2.add(Option.builder()
				.name("Capriciosa")
				.price(BigDecimal.valueOf(40.0))
				.minCount(1)
				.maxCount(1)
				.build());

		options2.add(Option.builder()
				.name("Prosciutto e Funghi")
				.price(BigDecimal.valueOf(50.0))
				.minCount(1)
				.maxCount(1)
				.build());

		options2.add(Option.builder()
				.name("Quattro Stagioni")
				.price(BigDecimal.valueOf(60.0))
				.minCount(1)
				.maxCount(1)
				.build());

		optionLists.get(1).getOptions().addAll(options2);
		optionRepository.saveAll(options2);

		List<Option> options3 = new ArrayList<>();

		options3.add(Option.builder()
				.name("Sos dulce")
				.price(BigDecimal.valueOf(0.0))
				.minCount(0)
				.maxCount(4)
				.build());

		options3.add(Option.builder()
				.name("Sos Picant")
				.price(BigDecimal.valueOf(0.0))
				.minCount(0)
				.maxCount(4)
				.build());

		options3.add(Option.builder()
				.name("Maioneza")
				.price(BigDecimal.valueOf(0.0))
				.minCount(0)
				.maxCount(4)
				.build());

		options3.add(Option.builder()
				.name("Maioneza cu usturoi")
				.price(BigDecimal.valueOf(0.0))
				.minCount(0)
				.maxCount(4)
				.build());

		optionLists.get(3).getOptions().addAll(options3);
		optionRepository.saveAll(options3);
	}


	@Transactional
	public void bindOptionsToProducts() {
		List<Product> products = productRepository.findAll(Sort.by(Sort.Order.asc("name")));
		List<OptionList> optionLists = optionListRepository.findAll();

		products.get(0).getOptionLists().add(optionLists.get(0));
		products.get(0).getOptionLists().add(optionLists.get(1));
		products.get(0).getOptionLists().add(optionLists.get(3));

		products.get(1).getOptionLists().add(optionLists.get(1));
		products.get(1).getOptionLists().add(optionLists.get(2));
	}
}
