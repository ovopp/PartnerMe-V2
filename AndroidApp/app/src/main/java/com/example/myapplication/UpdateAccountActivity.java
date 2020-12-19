package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

public class UpdateAccountActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup_main);

        final Gson g = new Gson();
        final RequestQueue requestQueue = Volley.newRequestQueue(this);
        final String urlUpdate = getResources().getString(R.string.update_accounturl);
        final String urlUser = getResources().getString(R.string.currentuserurl);
        final JSONObject updateObject = new JSONObject();
        final JSONObject userObject = new JSONObject();

        final EditText nameField = findViewById(R.id.signup_nameField);
        final EditText languageField = findViewById(R.id.signup_Language);
        final EditText classField = findViewById(R.id.signup_ClassField);
        final EditText hobbyField = findViewById(R.id.signup_Hobbies);
        final Spinner availabilitySpinner = findViewById(R.id.signup_AvailabilitySpinner);

        Button signupButton = findViewById(R.id.signupButton);
        signupButton.setHint("Update Account");
        try {
            userObject.put("email", getIntent().getStringExtra("email"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, urlUser, userObject,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        User userObject2;
                        try {
                            userObject2 = g.fromJson(response.get("user").toString(), User.class);
                            nameField.setText(userObject2.getName());
                            languageField.setText(userObject2.getLanguage());
                            classField.setText(userObject2.getUserClass());
                            hobbyField.setText(userObject2.getHobbies());
                            setSpinner(availabilitySpinner,userObject2.getAvailability());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println(error.toString());
            }
        });
        requestQueue.add(jsonObjectRequest);

        signupButton.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                if (nameField.getText().toString().trim().isEmpty() ||
                        languageField.getText().toString().trim().isEmpty() ||
                        classField.getText().toString().trim().isEmpty() ||
                        hobbyField.getText().toString().trim().isEmpty()) {

                    if (hobbyField.getText().toString().trim().isEmpty()) {
                        hobbyField.setError("Hobby is required");
                        hobbyField.requestFocus();
                    }
                    if (languageField.getText().toString().trim().isEmpty()) {
                        languageField.setError("Language is required");
                        languageField.requestFocus();
                    }
                    if (classField.getText().toString().trim().isEmpty()) {
                        classField.setError("Class is required");
                        classField.requestFocus();
                    }
                    if (nameField.getText().toString().trim().isEmpty()) {
                        nameField.setError("Name is required");
                        nameField.requestFocus();
                    }

                    Toast.makeText(UpdateAccountActivity.this, "Update not complete, please make sure fields are not empty", Toast.LENGTH_SHORT).show();
                } else {
                    // send post request with fields
                    try {
                        updateObject.put("name", nameField.getText().toString());
                        updateObject.put("language", languageField.getText().toString().replaceAll(" ", "").toUpperCase());
                        updateObject.put("class", classField.getText().toString().replaceAll(" ", "").toUpperCase());
                        updateObject.put("availability", availabilitySpinner.getSelectedItem().toString());
                        updateObject.put("hobbies", hobbyField.getText().toString());
                        updateObject.put("email", getIntent().getStringExtra("email"));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, urlUpdate, updateObject,
                            new Response.Listener<JSONObject>() {
                                @Override
                                public void onResponse(JSONObject response) {
                                    try {
                                        if((Boolean) response.get("success")){
                                            // successful signup with get us to the main activity
                                            Intent intent = new Intent(UpdateAccountActivity.this, MainActivity.class);
                                            startActivity(intent);
                                        }
                                        else{
                                            Toast.makeText(UpdateAccountActivity.this, "Update not complete, please make sure fields are not empty or your internet connection", Toast.LENGTH_SHORT).show();
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
        });
    }

    void setSpinner(Spinner spinner, String word){
        int i;
        for(i = 1 ; i < 3 ; i ++){
            if(spinner.getSelectedItem().toString().equals(word)){
                return;
            }
            else{
                spinner.setSelection(i);
            }
        }
    }
}
