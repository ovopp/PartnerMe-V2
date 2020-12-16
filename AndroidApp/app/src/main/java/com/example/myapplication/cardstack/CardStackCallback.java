package com.example.myapplication.cardstack;

import java.util.List;

import androidx.recyclerview.widget.DiffUtil;

import com.example.myapplication.User;

public class CardStackCallback extends DiffUtil.Callback {

    private final List<User> old;
    private final List<User> next;

    public CardStackCallback(List<User> old, List<User> next) {
        this.old = old;
        this.next = next;
    }

    @Override
    public int getOldListSize() {
        return old.size();
    }

    @Override
    public int getNewListSize() {
        return next.size();
    }

    @Override
    public boolean areItemsTheSame(int oldItemPosition, int newItemPosition) {
        return old.get(oldItemPosition).getEmail().equals(next.get(newItemPosition).getEmail());
    }

    @Override
    public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
        return old.get(oldItemPosition) == next.get(newItemPosition);
    }
}