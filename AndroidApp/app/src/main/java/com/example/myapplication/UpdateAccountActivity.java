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

import org.json.JSONException;
import org.json.JSONObject;

public class UpdateAccountActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup_main);

        final RequestQueue requestQueue = Volley.newRequestQueue(this);
        final String url = getResources().getString(R.string.update_accounturl);
        final JSONObject object = new JSONObject();

        final EditText nameField = findViewById(R.id.signup_nameField);
        final EditText languageField = findViewById(R.id.signup_Language);
        final EditText classField = findViewById(R.id.signup_ClassField);
        final EditText hobbyField = findViewById(R.id.signup_Hobbies);
        final Spinner availabilitySpinner = findViewById(R.id.signup_AvailabilitySpinner);

        Button signupButton = findViewById(R.id.signupButton);
        signupButton.setHint("Update Account");
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
                        object.put("name", nameField.getText().toString());
                        object.put("language", languageField.getText().toString().replaceAll(" ", "").toUpperCase());
                        object.put("class", classField.getText().toString().replaceAll(" ", "").toUpperCase());
                        object.put("availability", availabilitySpinner.getSelectedItem().toString());
                        object.put("hobbies", hobbyField.getText().toString());
                        object.put("email", getIntent().getStringExtra("email"));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    final JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, url, object,
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
}
