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
                  :input-value="data.selected"
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
              :items="ccRecepients"
              :return-object="false"
              label="Cc"
              chips
              item-value="email"
              multiple
            >
              <template v-slot:selection="data">
                <v-chip
                  :key="JSON.stringify(data.item)"
                  :input-value="data.selected"
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
              :items="bccRecepients"
              :return-object="false"
              label="Bcc"
              chips
              item-value="email"
              multiple
            >
              <template v-slot:selection="data">
                <v-chip
                  :key="JSON.stringify(data.item)"
                  :input-value="data.selected"
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
            <editor
              :options="editorOptions"
              height="300px"
              initialEditType="wysiwyg"
              previewStyle="vertical"
              ref="toastuiEditor"
            />
            <input type="file" @change="previewFiles" multiple />
            <v-btn @click="check">check</v-btn>
            <v-btn :disabled="dialog || success || fail" @click="send"
              >Send</v-btn
            >
            <!-- <v-dialog v-model="dialog" hide-overlay persistent width="300">
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
            </v-dialog> -->
            <!-- <v-dialog v-model="success" hide-overlay persistent width="300">
              <v-card color="green" dark>
                <v-card-text>Email Sent Successfully</v-card-text>
              </v-card>
            </v-dialog>
            <v-dialog v-model="fail" hide-overlay persistent width="300">
              <v-card color="red" dark>
                <v-card-text>Unable To Send Email</v-card-text>
              </v-card>
            </v-dialog> -->
            <!-- <img src="./desktop1.jpg"> -->
            <v-overlay v-if="dialog" absolute color="#036358">
              <v-text v-if="success">Email Sent Successfully!</v-text>
              <v-text v-else-if="fail">Unable To Send Email</v-text>
              <v-text v-else>Sending Email ...</v-text>
            </v-overlay>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { functions } from "../firebase/init";
import "@firebase/functions";
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default {
  name: "EmailUI",
  components: {
    editor: Editor
  },
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
      toEmail: [],
      fail: false,
      dialog: false,
      valid: false,
      to: null,
      cc: null,
      bcc: null,
      subject: null,
      message: null,
      editorOptions: {
        hideModeSwitch: true,
        toolbarItems: [
          "heading",
          "bold",
          "italic",
          "strike",
          "divider",
          "hr",
          "quote",
          "divider",
          "ul",
          "ol",
          "divider",
          "table",
          "link",
          "divider"
        ]
      },
      ccRecepients: [],
      bccRecepients: [],
      recepients: [],
      files: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    check() {
      console.log(this.$refs.toastuiEditor.invoke("getHtml"));
    },
    async previewFiles(event) {
      await getBase64(event.target.files[0]).then(fileInfo => {
        fileInfo = fileInfo.substring(fileInfo.indexOf(",") + 1);
        this.files.push({
          name: event.target.files[0].name,
          size: event.target.files[0].size,
          type: event.target.files[0].type,
          info: fileInfo
        });
      });
    },
    async send() {
      if (this.$refs.form.validate()) {
        const toList = [];
        const ccList = [];
        const bccList = [];
        this.formatList(this.to, toList);
        this.formatList(this.cc, ccList);
        this.formatList(this.bcc, bccList);
        let html = this.$refs.toastuiEditor.invoke("getHtml");
        let message = {
          to: toList,
          subject: this.subject,
          message: html,
          cc: ccList,
          bcc: bccList,
          files: Object.values(this.files)
        };
        console.log("message");
        console.log(message);
        this.dialog = true;
        await functions
          .httpsCallable("sendEmail")(message)
          .then(result => {
            console.log(result);
            this.success = true;
          })
          .catch(error => {
            console.log(error);
            this.fail = true;
          });
        this.to = null;
        this.cc = null;
        this.bcc = null;
        this.subject = null;
        this.message = null;
        this.files = [];
        this.dialog = false;
        this.success = false;
        this.fail = false;
        this.$refs.toastuiEditor.invoke("setHtml", "");
      }
    },
    formatList(recipient, recipientList) {
      if (recipient) {
        for (let i = 0; i < recipient.length; i++) {
          recipientList.push("<" + recipient[i] + ">");
        }
      }
    }
  }
};
</script>

<style>
.tui-editor-contents {
  text-align: start;
}
</style>
