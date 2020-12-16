package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.NavigationUI;
import android.os.Bundle;
import android.util.Log;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.iid.FirebaseInstanceId;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottomNavigationView);
        NavController navController = Navigation.findNavController(this,  R.id.fragment);
        NavigationUI.setupWithNavController(bottomNavigationView, navController);

        String s = FirebaseInstanceId.getInstance().getToken();
        sendRegistrationToServer(s);
    }

    private void sendRegistrationToServer(String s) {
        final String TAG = "TOKEN";
        final RequestQueue requestQueue = Volley.newRequestQueue(this);
        final String url = getResources().getString(R.string.tokenurl);
        final JSONObject object = new JSONObject();
        if (GoogleSignIn.getLastSignedInAccount(this) != null) {
            GoogleSignInAccount acct = GoogleSignIn.getLastSignedInAccount(this);
            try {
                object.put("email", acct.getEmail());
                object.put("token", s);
                Log.d("TOKEN", s);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            try {
                                if((Boolean) response.get("success")){
                                    Log.d(TAG, "token sent");
                                }
                                else{
                                    Log.d(TAG, "token not sent");
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println(error);
                }
            });
            requestQueue.add(jsonObjectRequest);

        }

    }
}