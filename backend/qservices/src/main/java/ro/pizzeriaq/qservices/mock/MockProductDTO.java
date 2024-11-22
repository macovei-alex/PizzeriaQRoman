package ro.pizzeriaq.qservices.mock.controllers;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class MockProductDTO {
    private long id;
    private String name;
    private String subtitle;
    private String description;
    private double price;
    private String imageUrl;
    private long categoryId;
}
