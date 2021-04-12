<template>
  <v-layout justify-center pa-5>
    <v-flex xs12 sm12 md12>
      <v-card>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <template v-slot:item="data">
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                <v-list-tile-sub-title
                  v-html="data.item.email"
                ></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
            <v-combobox
              v-model="to"
              :rules="emailRules"
              :items="recepients"
              :return-object="false"
              label="To"
              chips
              item-value="email"
              multiple
              required
            >
              <template v-slot:selection="data">
                <v-chip
                  :key="JSON.stringify(data.item)"
                  :selected="data.selected"
                  :disabled="data.disabled"
                  class="v-chip--select-multi"
                  @input="data.parent.selectItem(data.item)"
                  >{{ data.item }}</v-chip
                >
              </template>
              <template v-slot:item="data">
                <v-list-tile-content>
                  <v-list-tile-title
                    v-html="data.item.name"
                  ></v-list-tile-title>
                  <v-list-tile-sub-title
                    v-html="data.item.affiliation"
                  ></v-list-tile-sub-title>
                </v-list-tile-content>
              </template>
            </v-combobox>
            <v-combobox
              v-model="cc"
              :rules="ccRules"
              :items="recepients"
              :return-object="false"
              label="Cc"
              chips
              item-value="email"
              multiple
            >
              <template v-slot:selection="data">
                <v-chip
                  :key="JSON.stringify(data.item)"
                  :selected="data.selected"
                  :disabled="data.disabled"
                  class="v-chip--select-multi"
                  @input="data.parent.selectItem(data.item)"
                  >{{ data.item }}</v-chip
                >
              </template>
              <template v-slot:item="data">
                <v-list-tile-content>
                  <v-list-tile-title
                    v-html="data.item.name"
                  ></v-list-tile-title>
                  <v-list-tile-sub-title
                    v-html="data.item.affiliation"
                  ></v-list-tile-sub-title>
                </v-list-tile-content>
              </template>
            </v-combobox>
            <v-combobox
              v-model="bcc"
              :rules="ccRules"
              :items="recepients"
              :return-object="false"
              label="Bcc"
              chips
              item-value="email"
              multiple
            >
              <template v-slot:selection="data">
                <v-chip
                  :key="JSON.stringify(data.item)"
                  :selected="data.selected"
                  :disabled="data.disabled"
                  class="v-chip--select-multi"
                  @input="data.parent.selectItem(data.item)"
                  >{{ data.item }}</v-chip
                >
              </template>
              <template v-slot:item="data">
                <v-list-tile-content>
                  <v-list-tile-title
                    v-html="data.item.name"
                  ></v-list-tile-title>
                  <v-list-tile-sub-title
                    v-html="data.item.affiliation"
                  ></v-list-tile-sub-title>
                </v-list-tile-content>
              </template>
            </v-combobox>
            <v-text-field
              v-model="subject"
              :rules="notEmptyRules"
              label="Subject"
              required
            ></v-text-field>
            <v-textarea
              v-model="message"
              :rules="notEmptyRules"
              label="Message"
              auto-grow
              required
            ></v-textarea>
            <v-btn
              :disabled="dialog || success || fail"
              :loading="dialog || success || fail"
              @click="send"
              >Send</v-btn
            >
            <v-dialog v-model="dialog" hide-overlay persistent width="300">
              <v-card color="primary" dark>
                <v-card-text>
                  Sending Email
                  <v-progress-linear
                    indeterminate
                    color="white"
                    class="mb-0"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog v-model="success" hide-overlay persistent width="300">
              <v-card color="green" dark>
                <v-card-text>Email Sent Successfully</v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog v-model="fail" hide-overlay persistent width="300">
              <v-card color="red" dark>
                <v-card-text>Unable To Send Email</v-card-text>
              </v-card>
            </v-dialog>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { functions } from "../firebase/init";
import "@firebase/functions";
export default {
  name: "EmailUI",
  data() {
    return {
      ccRules: [
        v => {
          if (v == null) {
            return true;
          } else {
            return (
              /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/.test(
                v
              ) || "E-mail must be valid"
            );
          }
        }
      ],
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/.test(
            v
          ) || "E-mail must be valid"
      ],
      notEmptyRules: [v => !!v || "Field is required"],
      success: false,
      toEmail: "",
      fail: false,
      dialog: false,
      valid: false,
      to: null,
      cc: null,
      bcc: null,
      subject: null,
      message: null,
      recepients: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async send() {
      if (this.$refs.form.validate()) {
        this.toEmail = this.to.join();
        let message = {
          to: this.toEmail,
          subject: this.subject,
          text: this.message
        };
        this.dialog = true;
        functions.httpsCallable("sendEmail")(message);
      }
    }
  }
};
</script>
