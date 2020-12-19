package com.example.myapplication;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.squareup.picasso.Picasso;

public class UserPageFragment extends Fragment {

    public static UserPageFragment newInstance() {
        return new UserPageFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_second, container, false);
        if (GoogleSignIn.getLastSignedInAccount(getContext()) != null) {
            final GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(getContext());
            String name = acct.getDisplayName();
            Uri uri = acct.getPhotoUrl();

            TextView tv = rootView.findViewById(R.id.profile_name);
            ImageView img = rootView.findViewById(R.id.profile_picture);
            if (name != null)
                tv.setText(name);
            if (uri != null)
                Picasso.get().load(uri).into(img);
            // Inflate the layout for this fragment


            rootView.findViewById(R.id.update_account_button).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(getContext(), UpdateAccountActivity.class);
                    intent.putExtra("email", acct.getEmail());
                    startActivity(intent);
                }
            });
        }

        return rootView;
    }
}