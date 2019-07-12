<template>
  <v-app>
    <div v-if="!loading">
      <v-toolbar flat color="white">
        <v-toolbar-title>MY Table</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="editedItem.id" label="Id" disabled></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="editedItem.name" label="Name" :rules="nameRules"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field v-model="editedItem.location" label="Location" :rules="nameRules"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                      type="number"
                      v-model="editedItem.currency"
                      label="Currency"
                      :rules="currencyRules"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="lists"
        :search="search"
        hide-actions
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td class="text-xs">{{ props.item.name }}</td>
          <td class="text-xs">{{ props.item.location }}</td>
          <td class="text-xs">{{ props.item.currency }}</td>
          <td class="justify-centr layout px-0">
            <v-icon small class="ml-4 mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </template>
        <template v-slot:footer>
          <td>
            <strong>Summary Currency: {{countSum}}</strong>
          </td>
        </template>
      </v-data-table>
    </div>
    <div v-else>loading...</div>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    search: "",
    headers: [
      { text: "Id", align: "left", value: "id" },
      { text: "Name", value: "name" },
      { text: "Location", value: "location" },
      { text: "Currency", value: "currency" },
      { text: "Actions", value: "name", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {},
    nameRules: [
      v => !!v || "This field is required",
      v => (v && v.length <= 10) || "This field be less than 10 characters"
    ],
    currencyRules: [
      v => !!v || "this field is required",
      v => (v && parseInt(v, 10) >= 0) || "Currency must be positive number"
    ]
  }),

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  computed: {
    lists() {
      return this.$store.getters.myData;
    },
    loading() {
      return this.$store.getters.loading;
    },
    countSum() {
      return this.lists.reduce((accumuator, currentVal) => {
        return accumuator + parseInt(currentVal.currency, 10);
      }, 0);
    }
  },

  methods: {
    editItem(item) {
      this.dialog = true;
      this.editedIndex = this.lists.indexOf(item);
      this.editedItem = Object.assign({}, item); 
    },
    deleteItem(item) {
      const index = this.lists.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.lists.splice(index, 1);
    },
    close() {
      this.dialog = false;
    },
    save() {
      Object.assign(this.lists[this.editedIndex], this.editedItem);
      this.close();
    }
  },
  created() {
    return this.$store.dispatch("getData");
  }
};
</script>
