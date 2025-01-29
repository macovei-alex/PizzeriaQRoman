package ro.pizzeriaq.qservices.service;


import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.model.*;
import ro.pizzeriaq.qservices.data.repository.*;

import javax.swing.text.html.parser.Entity;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class EntityInitializerService {
	ProductRepository productRepository;
	ProductCategoryRepository categoryRepository;
	OptionListRepository optionListRepository;
	OptionRepository optionRepository;
	AccountRepository accountRepository;
	OrderRepository orderRepository;
	OrderItemRepository orderItemRepository;


	public EntityInitializerService(ProductRepository productRepository,
									ProductCategoryRepository categoryRepository,
									OptionListRepository optionListRepository,
									OptionRepository optionRepository,
									AccountRepository accountRepository,
									OrderRepository orderRepository,
									OrderItemRepository orderItemRepository) {
		this.productRepository = productRepository;
		this.categoryRepository = categoryRepository;
		this.optionListRepository = optionListRepository;
		this.optionRepository = optionRepository;
		this.accountRepository = accountRepository;
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
	}


	public static void reInitializeEntities(EntityInitializerService entityInitializerService) {
		entityInitializerService.deleteAll();

		entityInitializerService.addProducts();
		entityInitializerService.addOptionLists();
		entityInitializerService.bindOptionsToProducts();
		entityInitializerService.addAccounts();
		entityInitializerService.addOrders();
	}


	@Transactional
	public void deleteAll() {
		orderItemRepository.deleteAll();
		productRepository.deleteAll();
		categoryRepository.deleteAll();
		optionListRepository.deleteAll();
		optionRepository.deleteAll();
		orderRepository.deleteAll();
		accountRepository.deleteAll();

		orderItemRepository.flush();
		productRepository.flush();
		categoryRepository.flush();
		optionListRepository.flush();
		optionRepository.flush();
		orderRepository.flush();
		accountRepository.flush();
	}


	@Transactional
	public void addProducts() {
		List<ProductCategory> categories = new ArrayList<>();

		categories.add(ProductCategory.builder().name("Cele mai vândute").sortId(1).build());
		categories.add(ProductCategory.builder().name("Pizza 1+1 combo").sortId(2).build());
		categories.add(ProductCategory.builder().name("Băuturi non-alcoolice").sortId(10).build());

		categories = categoryRepository.saveAll(categories);

		List<Product> products = new ArrayList<>();

		products.add(Product.builder()
				.category(categories.get(0))
				.name("Pizza Capriciosa")
				.subtitle("1+1 Gratis la alegere")
				.description("Ingrediente: sos, salam, cabanos, ciuperci, măsline, mozzarella, roșii, ardei - 550g")
				.price(BigDecimal.valueOf(30.0))
				.imageName("pizza-capriciosa.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(0))
				.name("Pizza Quattro Formaggi")
				.subtitle("1+1 Gratis la alegere")
				.description("500g")
				.price(BigDecimal.valueOf(35.0))
				.imageName("pizza-quattro-formaggi.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(0))
				.name("Pizza Quattro Stagioni")
				.subtitle("1+1 Gratis la alegere")
				.description("500g")
				.price(BigDecimal.valueOf(40.0))
				.imageName("pizza-quattro-stagioni.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(1))
				.name("Pizza Margherita")
				.subtitle("1+1 Gratis la alegere")
				.description("500g")
				.price(BigDecimal.valueOf(30.0))
				.imageName("pizza-margherita.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(1))
				.name("Pizza Țărănească")
				.subtitle("1+1 Gratis la alegere")
				.description("500g")
				.price(BigDecimal.valueOf(30.0))
				.imageName("pizza-țărănească.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(2))
				.name("Pepsi")
				.subtitle("0.33L")
				.description("")
				.price(BigDecimal.valueOf(5.0))
				.imageName("pepsi.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(2))
				.name("Fanta Portocale")
				.subtitle("0.33L")
				.description("")
				.price(BigDecimal.valueOf(5.0))
				.imageName("fanta-portocale.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(2))
				.name("Sprite")
				.subtitle("0.33L")
				.description("")
				.price(BigDecimal.valueOf(5.0))
				.imageName("sprite.jpg")
				.build());

		productRepository.saveAll(products);
	}


	@Transactional
	public void addOptionLists() {
		List<OptionList> optionLists = new ArrayList<>();

		optionLists.add(OptionList.builder()
				.options(new ArrayList<>())
				.text("Prima Pizza cu Margine Umplută cu Brânză Ricotta?")
				.minChoices(1)
				.maxChoices(1)
				.build());

		optionLists.add(OptionList.builder()
				.options(new ArrayList<>())
				.text("Alege a Doua Pizza")
				.minChoices(1)
				.maxChoices(1)
				.build());

		optionLists.add(OptionList.builder()
				.options(new ArrayList<>())
				.text("A Doua Pizza cu Margine Umplută cu Brânză Ricotta")
				.minChoices(1)
				.maxChoices(1)
				.build());

		optionLists.add(OptionList.builder()
				.options(new ArrayList<>())
				.text("Dorești sos?")
				.minChoices(0)
				.maxChoices(4)
				.build());

		optionLists = optionListRepository.saveAll(optionLists);

		List<Option> options1 = new ArrayList<>();
		options1.add(Option.builder()
				.name("cu brânză Ricotta")
				.price(BigDecimal.valueOf(8.0))
				.minCount(1)
				.maxCount(1)
				.build());

		options1.add(Option.builder()
				.name("fără brânză Ricotta")
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
				.name("Maioneză")
				.price(BigDecimal.valueOf(0.0))
				.minCount(0)
				.maxCount(4)
				.build());

		options3.add(Option.builder()
				.name("Maioneză cu usturoi")
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

		products.get(2).getOptionLists().add(optionLists.get(0));
		products.get(2).getOptionLists().add(optionLists.get(1));
		products.get(2).getOptionLists().add(optionLists.get(3));

		products.get(3).getOptionLists().add(optionLists.get(1));
		products.get(3).getOptionLists().add(optionLists.get(2));
	}


	@Transactional
	public void addAccounts() {
		List<Account> accounts = new ArrayList<>();
		accounts.add(Account.builder()
				.phoneNumber("0722 222 222")
				.createdTimestamp(LocalDateTime.now().minusHours(2))
				.build());

		accountRepository.saveAll(accounts);
	}


	@Transactional
	public void addOrders() {
		List<Account> accounts = accountRepository.findAll();
		List<Product> products = productRepository.findAll();
		List<Order> orders = new ArrayList<>();

		orders.add(Order.builder()
				.account(accounts.get(0))
				.orderItems(new ArrayList<>())
				.orderStatus(OrderStatus.RECEIVED)
				.estimatedPreparationTime(30)
				.orderTimestamp(LocalDateTime.now().minusMinutes(36))
				.deliveryTimestamp(LocalDateTime.now().minusMinutes(2))
				.additionalNotes("Una dintre ele fără ciuperci")
				.totalPrice(BigDecimal.valueOf(0))
				.totalPriceWithDiscount(BigDecimal.valueOf(0))
				.build());

		orders.add(Order.builder()
				.account(accounts.get(0))
				.orderItems(new ArrayList<>())
				.orderStatus(OrderStatus.IN_PREPARATION)
				.estimatedPreparationTime(45)
				.orderTimestamp(LocalDateTime.now().minusMinutes(24))
				.deliveryTimestamp(null)
				.additionalNotes(null)
				.totalPrice(BigDecimal.valueOf(0))
				.totalPriceWithDiscount(BigDecimal.valueOf(0))
				.build());

		orderRepository.saveAll(orders);

		List<OrderItem> orderItems1 = new ArrayList<>();
		orderItems1.add(OrderItem.builder()
				.order(orders.get(0))
				.options(List.of())
				.product(products.get(0))
				.count(2)
				.totalPrice(products.get(0).getPrice().multiply(BigDecimal.valueOf(2)))
				.totalPriceWithDiscount(products.get(0).getPrice().multiply(BigDecimal.valueOf(2)).subtract(BigDecimal.valueOf(10)))
				.build());
		orderItems1.add(OrderItem.builder()
				.order(orders.get(0))
				.options(List.of())
				.product(products.get(1))
				.count(1)
				.totalPrice(products.get(1).getPrice())
				.totalPriceWithDiscount(products.get(1).getPrice().subtract(BigDecimal.valueOf(5)))
				.build());

		orderItemRepository.saveAll(orderItems1);

		orders.get(0).setTotalPrice(orderItems1.stream()
				.map(OrderItem::getTotalPrice)
				.reduce(BigDecimal::add)
				.orElseThrow());
		orders.get(0).setTotalPriceWithDiscount(orderItems1.stream()
				.map(OrderItem::getTotalPriceWithDiscount)
				.reduce(BigDecimal::add)
				.orElseThrow());

		List<OrderItem> orderItems2 = new ArrayList<>();
		orderItems2.add(OrderItem.builder()
				.order(orders.get(1))
				.options(List.of())
				.product(products.get(3))
				.count(4)
				.totalPrice(products.get(3).getPrice().multiply(BigDecimal.valueOf(4)))
				.totalPriceWithDiscount(products.get(3).getPrice().multiply(BigDecimal.valueOf(4)).subtract(BigDecimal.valueOf(15)))
				.build());
		orderItems2.add(OrderItem.builder()
				.order(orders.get(1))
				.options(List.of())
				.product(products.get(6))
				.count(2)
				.totalPrice(products.get(6).getPrice())
				.totalPriceWithDiscount(products.get(6).getPrice())
				.build());

		orderItemRepository.saveAll(orderItems2);

		orders.get(1).setTotalPrice(orderItems2.stream()
				.map(OrderItem::getTotalPrice)
				.reduce(BigDecimal::add)
				.orElseThrow());
		orders.get(1).setTotalPriceWithDiscount(orderItems2.stream()
				.map(OrderItem::getTotalPriceWithDiscount)
				.reduce(BigDecimal::add)
				.orElseThrow());
	}
}
