import Colors from "@/assets/fonts/color";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
} from "react-native";

const API_URL = "http://172.20.10.3:5000"; // à adapter selon ton serveur

const ResetPassword = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { email: "" },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Succès", "Un lien ou un code a été envoyé à votre adresse email.");
        router.push("/reset-password"); // Redirige vers le second écran
      } else {
        Alert.alert("Erreur", result.message || "Une erreur s’est produite.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      Alert.alert("Erreur réseau", "Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const emailValue = watch("email");

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Réinitialiser le mot de passe</Text>
      <Text style={styles.subtitle}>
        Entre ton adresse email pour recevoir un lien de réinitialisation
      </Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Adresse Email</Text>
        <Controller
          control={control}
          rules={{ required: "L'email est requis" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="ex: ton@email.com"
              keyboardType="email-address"
              placeholderTextColor="#aaa"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="email"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Pressable
          style={[styles.button, !emailValue && { backgroundColor: "gray" }]}
          onPress={handleSubmit(onSubmit)}
          disabled={!emailValue || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Envoyer le lien</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.backLink}>Retour à la connexion</Text>
        </Pressable>

        <Text style={styles.legal}>
          En utilisant Mulema, tu acceptes nos{" "}
          <Text style={styles.legalLink} onPress={() => Linking.openURL("https://mulema/politique")}>
            Conditions d'utilisation
          </Text>{" "}
          et notre{" "}
          <Text style={styles.legalLink} onPress={() => Linking.openURL("https://mulema/confidentialite")}>
            Politique de confidentialité
          </Text>.{"\n"}
          Cette application est protégée par reCAPTCHA Enterprise. La{" "}
          <Text style={styles.legalLink} onPress={() => Linking.openURL("https://policies.google.com/privacy")}>
            Politique de confidentialité
          </Text>{" "}
          et les{" "}
          <Text style={styles.legalLink} onPress={() => Linking.openURL("https://policies.google.com/terms")}>
            Conditions d'utilisation
          </Text>{" "}
          de Google s’appliquent.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.gris2,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    height: 45,
    backgroundColor: Colors.gris,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "red",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  backLink: {
    color: "red",
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  legal: {
    fontSize: 12,
    color: "#888",
    marginTop: 30,
    textAlign: "center",
  },
  legalLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default ResetPassword;
