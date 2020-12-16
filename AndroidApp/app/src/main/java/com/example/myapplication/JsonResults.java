package com.example.myapplication;

class JsonResults {
    public static class MatchResult {
        private Float similarity;
        private User userList;

        public Float getSimilarity(){ return this.similarity;}
        public User getUser(){ return this.userList; }
    }

    public static class MessageResult {
        private String name;
        private String message;

        public String getUser(){ return this.name; }
        public String getMessage(){ return this.message; }
    }

    public static class MessageListResult {
        private String name;

        public String getName(){ return this.name; }
    }
}
