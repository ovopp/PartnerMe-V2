package com.example.myapplication.message;

public class Message {
    private String text;
    private String memberData;
    private boolean belongsToCurrentUser;

    public Message(String text, String data, boolean belongsToCurrentUser) {
        this.text = text;
        this.memberData = data;
        this.belongsToCurrentUser = belongsToCurrentUser;
    }

    public String getText() {
        return text;
    }

    public String getMemberData() {
        return memberData;
    }

    public boolean isBelongsToCurrentUser() {
        return belongsToCurrentUser;
    }
}