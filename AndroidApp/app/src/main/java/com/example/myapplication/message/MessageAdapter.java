package com.example.myapplication.message;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.example.myapplication.R;

import java.util.ArrayList;
import java.util.List;


public class MessageAdapter extends BaseAdapter {

    private List<Message> messages = new ArrayList<Message>();
    private Context context;

    public MessageAdapter(Context context) {
        this.context = context;
    }


    public void add(Message message) {
        this.messages.add(message);
        notifyDataSetChanged();
    }

    public void update(List<Message> messages) {
        this.messages = messages;
        notifyDataSetChanged();
    }

    @Override
    public int getCount() {
        return messages.size();
    }

    @Override
    public Object getItem(int i) {
        return messages.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View convertView, ViewGroup viewGroup) {
        View view = convertView;
        MessageViewHolder holder = new MessageViewHolder();
        LayoutInflater messageInflater = (LayoutInflater) context.getSystemService(Activity.LAYOUT_INFLATER_SERVICE);
        Message message = messages.get(i);

        if (message.isBelongsToCurrentUser()) {
            view = messageInflater.inflate(R.layout.my_message, null);
            holder.messageBody = (TextView) view.findViewById(R.id.message_body);
            view.setTag(holder);
            holder.messageBody.setText(message.getText());
        } else {
            view = messageInflater.inflate(R.layout.their_message, null);
            holder.avatar = (View) view.findViewById(R.id.avatar);
            holder.name = (TextView) view.findViewById(R.id.name);
            holder.messageBody = (TextView) view.findViewById(R.id.message_body);
            view.setTag(holder);

            holder.name.setText(message.getMemberData());
            holder.messageBody.setText(message.getText());
            TextView initial = (TextView) holder.avatar;
            initial.setText(message.getMemberData().substring(0, 1).toUpperCase());
        }

        return view;
    }

}

class MessageViewHolder {
    public View avatar;
    public TextView name;
    public TextView messageBody;
}