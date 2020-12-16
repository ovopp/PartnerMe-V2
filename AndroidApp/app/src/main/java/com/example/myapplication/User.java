package com.example.myapplication;

public class User {
    private String Name;
    private String Class;
    private String Language;
    private String Availability;
    private String Hobbies;
    private String Email;
    private String Token;

    public User() {
    }

    public User(String name, String classes, String language, String hobbies, String token) {
        this.Name = name;
        this.Class = classes;
        this.Language = language;
        this.Hobbies = hobbies;
        this.Token = token;
    }

    public String getName () {
        return this.Name;
    }

    public String getAvailability () {
        return this.Availability;
    }

    public String getUserClass() { return this.Class;}

    public String getHobbies() {return this.Hobbies;}

    public String getLanguage() {return this.Language;}

    public String getEmail() {return this.Email;}

    public String getToken() {return this.Token;}
}
