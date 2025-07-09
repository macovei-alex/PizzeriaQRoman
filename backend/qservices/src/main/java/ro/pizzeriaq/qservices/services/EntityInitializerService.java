package ro.pizzeriaq.qservices.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.pizzeriaq.qservices.data.entities.*;
import ro.pizzeriaq.qservices.data.model.KeycloakUser;
import ro.pizzeriaq.qservices.repositories.*;

import javax.naming.ServiceUnavailableException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.Stream;

@Service
@AllArgsConstructor
public class EntityInitializerService {

	private final ProductRepository productRepository;
	private final ProductCategoryRepository categoryRepository;
	private final OptionListRepository optionListRepository;
	private final OptionRepository optionRepository;
	private final AddressRepository addressRepository;
	private final AccountRepository accountRepository;
	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final OrderItem_OptionList_OptionRepository orderItemOptionListOptionRepository;
	private final KeycloakService keycloakService;


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
		orderItemOptionListOptionRepository.deleteAll();
		orderItemRepository.deleteAll();
		productRepository.deleteAll();
		categoryRepository.deleteAll();
		optionListRepository.deleteAll();
		optionRepository.deleteAll();
		orderRepository.deleteAll();
		addressRepository.deleteAll();
		accountRepository.deleteAll();

		orderItemRepository.flush();
		productRepository.flush();
		categoryRepository.flush();
		optionListRepository.flush();
		optionRepository.flush();
		orderRepository.flush();
		addressRepository.flush();
		accountRepository.flush();
	}


	@Transactional
	public void addProducts() {
		var categoryEntities = List.of(
				ProductCategory.builder().name("Pizza 1+1 Combo").sortId(400).build(),
				ProductCategory.builder().name("Pizza ⌀ 30 cm").sortId(500).build(),
				ProductCategory.builder().name("Fă-ți singur pizza").sortId(600).build(),
				ProductCategory.builder().name("Băuturi non-alcoolice").sortId(700).build(),
				ProductCategory.builder().name("Băuturi alcoolice").sortId(800).build()
		);
		var categories = categoryRepository.saveAll(categoryEntities);

		List<Product> products = new ArrayList<>();

		Supplier<Product.ProductBuilder> productBuilder1 = () -> Product.builder()
				.category(categories.get(0))
				.subtitle("1+1 Gratis la alegere")
				.price(BigDecimal.valueOf(70));

		products.add(productBuilder1.get()
				.name("Pizza Margherita")
				.description("Sos, mozzarella, parmezan, busuioc - 550g")
				.imageName("pizza-margherita.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Capriciosa")
				.description("Sos, bacon, șuncă, ciuperci, mozzarella, măsline - 550g")
				.imageName("pizza-capriciosa.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Prosciutto e Funghi")
				.description("Sos, șuncă, mozzarella, ciuperci - 580g")
				.imageName("pizza-prosciutto-e-funghi.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Țărănească")
				.description("Sos, salam, cabanos, ciuperci, măsline, mozzarella, roșii, ardei - 550g")
				.imageName("pizza-țărănească.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Diavola")
				.description("Sos, salam picant, peperoncino, mizzarella, ardei picant - 550g")
				.imageName("pizza-diavola.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Quattro Carne")
				.description("Sos, bacon, salam, piept de pui, cabanos, mozzarella, ceapă, ardei - 550g")
				.imageName("pizza-quattro-carne.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Q")
				.description("Sos, șuncă, salam, cabanos, ciuperci, mozzarella, roșii, ardei, masline - 620g")
				.imageName("pizza-q.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Arrabiatta")
				.description("Sos, salam picant, cabanos, mozzarella, ceapă, ardei picant - 550g")
				.imageName("pizza-arrabiatta.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Pollo")
				.description("Sos, piept de pui, ciuperci, mozzarella, porumb, ardei, roșii - 560g")
				.imageName("pizza-pollo.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Tradițională")
				.description("Sos, șuncă, piept de pui, ciuperci, mozzarella, ceapă - 540g")
				.imageName("pizza-tradițională.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Tonno Cipolla")
				.description("Sos, ton, mozzarella, ceapă, lămâie - 490g")
				.imageName("pizza-tonno-cipolla.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Vegetariană")
				.description("Sos, ciuperci, măsline, porumb, mozzarella, roșii, ceapă, ardei - 550g")
				.imageName("pizza-vegetariană.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Smirodava")
				.description("Sos, bacon, șuncă, salam, ardei, porumb, mozzarella, roșii - 610g")
				.imageName("pizza-smirodava.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Populară")
				.description("Sos, oregano, mozzarella, salam picant - 530g")
				.imageName("pizza-populară.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Magic")
				.description("Sos, bacon, salam, mozzarella, ardei - 550g")
				.imageName("pizza-magic.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Deliciosa")
				.description("Sos, bacon, cabanos, măsline, mozzarella, parmezan - 550g")
				.imageName("pizza-deliciosa.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Prosciutto")
				.description("Sos, șuncă, mozzarella, măsline - 550g")
				.imageName("pizza-prosciutto.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Hawaii")
				.description("Sos, șuncă, ananas, mozzarella - 550g")
				.imageName("pizza-hawaii.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Quattro Stagioni")
				.description("Sos, șuncă, salam, ciuperci, mozzarella, ardei, măsline - 560g")
				.imageName("pizza-quattro-stagioni.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Quattro Formaggi")
				.description("Sos, brânză tare, mozzarella, gorgonzola, parmezan - 550g")
				.imageName("pizza-quattro-formaggi.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Crispy")
				.description("Sos, piept de pui, cartofi, mozzarella - 580g")
				.imageName("pizza-crispy.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza de post")
				.description("Sos, brânză vegetală, ciuperci, măsline, porumb, roșii, ceapă, ardei - 550g")
				.imageName("pizza-de-post.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza de post cu ton")
				.description("Sos, ton, brânză vegetală, ceapă, lămâie - 490g")
				.imageName("pizza-de-post-cu-ton.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Carbonara")
				.description("Smântână, bacon, ciuperci, mozzarella, parmezan - 560g")
				.imageName("pizza-carbonara.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Pollo White")
				.description("Smântână, piept de pui, mozzarella, aredi, porumb - 510g")
				.imageName("pizza-pollo-white.jpg")
				.build());

		products.add(productBuilder1.get()
				.name("Pizza Vegetariană de post")
				.description("Sos, brânză vegetală, ciuperci, masline, porumb, roșii, ceapă, ardei - 550g")
				.imageName("pizza-vegetariană-de-post.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(0))
				.name("Sos picant")
				.price(BigDecimal.valueOf(2.5))
				.imageName("sos-picant.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(0))
				.name("Sos dulce")
				.price(BigDecimal.valueOf(2.5))
				.imageName("sos-dulce.jpg")
				.build());

		Supplier<Product.ProductBuilder> productBuilder2 = () -> Product.builder()
				.category(categories.get(1))
				.price(BigDecimal.valueOf(42));

		products.add(productBuilder2.get()
				.name("Pizza Prosciutto e Funghi")
				.description("Sos, șuncă, mozzarella, ciuperci - 580g")
				.imageName("pizza-prosciutto-e-funghi.jpg")
				.build());

		products.add(productBuilder2.get()
				.name("Pizza Țărănească")
				.description("Sos, salam, cabanos, ciuperci, măsline, mozzarella, roșii, ardei - 550g")
				.imageName("pizza-țărănească.jpg")
				.build());

		products.add(productBuilder2.get()
				.name("Pizza Diavola")
				.description("Sos, salam picant, peperoncino, mizzarella, ardei picant - 550g")
				.imageName("pizza-diavola.jpg")
				.build());

		products.add(productBuilder2.get()
				.name("Pizza Quattro Carne")
				.description("Sos, bacon, salam, piept de pui, cabanos, mozzarella, ceapă, ardei - 550g")
				.imageName("pizza-quattro-carne.jpg")
				.build());

		products.add(productBuilder2.get()
				.name("Pizza Q")
				.description("Sos, șuncă, salam, cabanos, ciuperci, mozzarella, roșii, ardei, masline - 620g")
				.imageName("pizza-q.jpg")
				.build());

		products.add(productBuilder2.get()
				.name("Pizza Pollo")
				.description("Sos, piept de pui, ciuperci, mozzarella, porumb, ardei, roșii - 560g")
				.imageName("pizza-pollo.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(3))
				.name("Coca-Cola Zero")
				.subtitle("330ml")
				.price(BigDecimal.valueOf(9.5))
				.imageName("coca-cola-zero.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(3))
				.name("Coca-Cola")
				.subtitle("330ml")
				.price(BigDecimal.valueOf(9.5))
				.imageName("coca-cola.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(3))
				.name("Fanta")
				.subtitle("330ml")
				.price(BigDecimal.valueOf(9.5))
				.imageName("fanta.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(3))
				.name("Sprite")
				.subtitle("330ml")
				.price(BigDecimal.valueOf(9.5))
				.imageName("sprite.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(3))
				.name("Fuze Tea")
				.subtitle("500ml")
				.price(BigDecimal.valueOf(9.5))
				.imageName("fuze-tea.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(3))
				.name("Cappy Pulpy")
				.subtitle("330ml")
				.price(BigDecimal.valueOf(9.5))
				.imageName("cappy-pulpy.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(3))
				.name("Dorna plată")
				.subtitle("500ml")
				.price(BigDecimal.valueOf(8.5))
				.imageName("dorna-plată.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(3))
				.name("Dorna carbogazoasă")
				.subtitle("500ml")
				.price(BigDecimal.valueOf(8.5))
				.imageName("dorna-carbogazoasă.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(4))
				.name("Bere Heineken")
				.subtitle("500ml")
				.price(BigDecimal.valueOf(10.5))
				.imageName("bere-heineken.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(4))
				.name("Bere Timișoreana")
				.subtitle("500ml")
				.price(BigDecimal.valueOf(9.5))
				.imageName("bere-timișoreana.jpg")
				.build());

		products.add(Product.builder()
				.category(categories.get(4))
				.name("Deleted Sprite")
				.subtitle("330ml / 500ml")
				.price(BigDecimal.valueOf(9.5))
				.imageName("sprite.jpg")
				.isActive(false)
				.build());

		productRepository.saveAll(products);
	}


	@Transactional
	public void addOptionLists() {
		List<OptionList> optionLists = new ArrayList<>();
		Supplier<OptionList.OptionListBuilder> singleChoiceOL = () -> OptionList.builder()
				.options(new ArrayList<>())
				.minChoices(1)
				.maxChoices(1);
		Supplier<OptionList.OptionListBuilder> multipleChoiceOL = () -> OptionList.builder()
				.options(new ArrayList<>())
				.minChoices(0)
				.maxChoices(100);

		optionLists.add(singleChoiceOL.get().text("Alege a doua pizza").build());
		optionLists.add(singleChoiceOL.get().text("Alege tipul de blat").build());
		optionLists.add(singleChoiceOL.get().text("Alege tipul de blat pentru prima pizza").build());
		optionLists.add(singleChoiceOL.get().text("Alege tipul de blat pentru a doua pizza").build());
		optionLists.add(multipleChoiceOL.get().maxChoices(4).text("Vrei sos?").build());
		optionLists.add(multipleChoiceOL.get().text("Adaugă extra topping la prima pizza").build());
		optionLists.add(multipleChoiceOL.get().text("Adaugă extra topping pentru a doua pizza").build());
		optionLists.add(multipleChoiceOL.get().text("Adaugă extra topping").build());
		optionLists.add(multipleChoiceOL.get().text("Adaugă extra băutură").build());

		optionLists = optionListRepository.saveAll(optionLists);

		List<Option> options1 = new ArrayList<>();
		Supplier<Option.OptionBuilder> optionBuilder1 = () -> Option.builder()
				.price(BigDecimal.valueOf(0))
				.minCount(0)
				.maxCount(1);

		options1.add(optionBuilder1.get().name("Margherita").build());
		options1.add(optionBuilder1.get().name("Capriciosa").build());
		options1.add(optionBuilder1.get().name("Prosciutto e Funghi").build());
		options1.add(optionBuilder1.get().name("Quattro Stagioni").build());
		options1.add(optionBuilder1.get().name("Țărănească").build());
		options1.add(optionBuilder1.get().name("Quattro Carne").build());
		options1.add(optionBuilder1.get().name("Pizza Q").build());
		options1.add(optionBuilder1.get().name("Quattro Formaggi").build());
		options1.add(optionBuilder1.get().name("Hawaii").build());
		options1.add(optionBuilder1.get().name("Prosciutto").build());
		options1.add(optionBuilder1.get().name("Arrabiatta").build());
		options1.add(optionBuilder1.get().name("Pollo").build());
		options1.add(optionBuilder1.get().name("Tradițională").build());
		options1.add(optionBuilder1.get().name("Tonno Cipolla").build());
		options1.add(optionBuilder1.get().name("Vegetariană").build());
		options1.add(optionBuilder1.get().name("Smirodava").build());
		options1.add(optionBuilder1.get().name("Populară").build());
		options1.add(optionBuilder1.get().name("Magic").build());
		options1.add(optionBuilder1.get().name("Delicioasa").build());
		options1.add(optionBuilder1.get().name("Crispy").build());
		options1.add(optionBuilder1.get().name("Pollo White").build());
		options1.add(optionBuilder1.get().name("Carbonara").build());
		options1.add(optionBuilder1.get().name("De post cu ton").build());

		optionLists.get(0).getOptions().addAll(options1);
		optionRepository.saveAll(options1);

		List<Option> options2 = new ArrayList<>();

		options2.add(Option.builder()
				.name("Blat simplu")
				.price(BigDecimal.valueOf(0))
				.minCount(0)
				.maxCount(1)
				.build());

		options2.add(Option.builder()
				.name("Margine umplută cu brânză Ricotta")
				.price(BigDecimal.valueOf(8))
				.minCount(0)
				.maxCount(1)
				.build());

		optionLists.get(1).getOptions().addAll(options2);
		optionLists.get(2).getOptions().addAll(options2);
		optionLists.get(3).getOptions().addAll(options2);
		optionRepository.saveAll(options2);

		List<Option> options3 = new ArrayList<>();
		Supplier<Option.OptionBuilder> optionBuilder3 = () -> Option.builder()
				.price(BigDecimal.valueOf(2.5))
				.minCount(0)
				.maxCount(4);

		options3.add(optionBuilder3.get().name("Sos dulce").build());
		options3.add(optionBuilder3.get().name("Sos picant").build());
		options3.add(optionBuilder3.get().name("Maioneză").build());
		options3.add(optionBuilder3.get().name("Maioneză cu usturoi").build());

		optionLists.get(4).getOptions().addAll(options3);
		optionRepository.saveAll(options3);

		var options4 = new ArrayList<Option>();
		Supplier<Option.OptionBuilder> optionBuilder4 = () -> Option.builder()
				.price(BigDecimal.valueOf(4))
				.minCount(0)
				.maxCount(100);

		options4.add(optionBuilder4.get().name("Salam nepicant").build());
		options4.add(optionBuilder4.get().name("Crispy de pui").build());
		options4.add(optionBuilder4.get().name("Șuncă Praga").build());
		options4.add(optionBuilder4.get().name("Bacon").build());
		options4.add(optionBuilder4.get().name("Cabanos").build());
		options4.add(optionBuilder4.get().name("Ton").build());
		options4.add(optionBuilder4.get().name("Salam picant").build());
		options4.add(optionBuilder4.get().name("Mozzarella").build());
		options4.add(optionBuilder4.get().name("Cașcaval").build());
		options4.add(optionBuilder4.get().name("Gorgonzola").build());
		options4.add(optionBuilder4.get().name("Parmezan").build());
		options4.add(optionBuilder4.get().name("Roșii").build());
		options4.add(optionBuilder4.get().name("Măsline").build());
		options4.add(optionBuilder4.get().name("Ardei iute").build());
		options4.add(optionBuilder4.get().name("Ardei").build());
		options4.add(optionBuilder4.get().name("Ceapă").build());
		options4.add(optionBuilder4.get().name("Ciuperci").build());
		options4.add(optionBuilder4.get().name("Ananas").build());
		options4.add(optionBuilder4.get().name("Porumb").build());
		options4.add(optionBuilder4.get().name("Piept de pui (pastramă)").build());

		optionLists.get(5).getOptions().addAll(options4);
		optionLists.get(6).getOptions().addAll(options4);
		optionLists.get(7).getOptions().addAll(options4);
		optionRepository.saveAll(options4);

		List<Option> options5 = new ArrayList<>();
		Supplier<Option.OptionBuilder> optionBuilder5 = () -> Option.builder()
				.price(BigDecimal.valueOf(9))
				.minCount(0)
				.maxCount(100);

		options5.add(optionBuilder5.get().name("Coca-Cola - 330ml").build());
		options5.add(optionBuilder5.get().name("Cocal-Cola Zero - 330ml").build());
		options5.add(optionBuilder5.get().name("Bere Timișoreana - 500ml").build());
		options5.add(optionBuilder5.get().name("Bere Heineken - 500ml").price(BigDecimal.valueOf(10)).build());
		options5.add(optionBuilder5.get().name("Cappy Pulpy - 300ml").build());

		optionLists.get(8).getOptions().addAll(options5);
		optionRepository.saveAll(options5);
	}


	@Transactional
	public void bindOptionsToProducts() {
		var products = productRepository.findAll();
		var optionLists = optionListRepository.findAll().stream()
				.sorted(Comparator.comparing(OptionList::getId))
				.toList();

		products.stream()
				.filter((p) -> p.getCategory().getName().equals("Pizza 1+1 Combo") && p.getName().contains("Pizza"))
				.forEach((p) -> p.getOptionLists().addAll(Stream.of(0, 2, 3, 4, 5, 6, 8).map(optionLists::get).toList()));

		products.stream()
				.filter((p) -> p.getCategory().getName().equals("Pizza ⌀ 30 cm"))
				.forEach((p) -> p.getOptionLists().addAll(Stream.of(1, 4, 7, 8).map(optionLists::get).toList()));
	}


	@Transactional
	public void addAccounts() {
		List<KeycloakUser> keycloakUsers;
		try {
			keycloakUsers = keycloakService.getUsers().stream()
					.sorted(Comparator.comparing(KeycloakUser::createdTimestamp))
					.toList();
		} catch (ServiceUnavailableException e) {
			throw new RuntimeException(e);
		}

		if (keycloakUsers.size() < 2) {
			throw new RuntimeException("Not enough users in Keycloak: a minimum of 2 users required");
		}

		List<Account> accounts = new ArrayList<>();
		var user = keycloakUsers.get(0);
		accounts.add(Account.builder()
				.id(user.id())
				.email(user.email())
				.isEmailVerified(user.emailVerified())
				.phoneNumber("0722 222 222")
				.createdAt(user.createdTimestampDate())
				.build());

		user = keycloakUsers.get(1);
		accounts.add(Account.builder()
				.id(user.id())
				.email(user.email())
				.isEmailVerified(user.emailVerified())
				.phoneNumber("0733 333 333")
				.createdAt(user.createdTimestampDate())
				.conversationId(UUID.randomUUID())
				.build());

		accountRepository.saveAll(accounts);

		List<Address> addresses = new ArrayList<>();
		addresses.add(Address.builder()
				.account(accounts.get(0))
				.addressType(AddressType.HOME)
				.addressString("Romania, Roman, Strada Libertății nr. 10")
				.isPrimary(true)
				.build());
		addresses.add(Address.builder()
				.account(accounts.get(0))
				.addressType(AddressType.WORK)
				.addressString("Romania, Roman, Strada Ștefan cel Mare nr. 244")
				.isPrimary(false)
				.build());
		addressRepository.saveAll(addresses);
	}


	@Transactional
	public void addOrders() {
		List<Account> accounts = accountRepository.findAllActiveSortByCreatedAt();
		List<Product> products = productRepository.findAll();
		List<Order> orders = new ArrayList<>();

		orders.add(Order.builder()
				.account(accounts.get(0))
				.address(accounts.get(0).getAddresses().get(0))
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
				.address(accounts.get(0).getAddresses().get(0))
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
