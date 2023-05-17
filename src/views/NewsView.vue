<template>
  <h1>Listado de Noticias</h1>
  <div class="row">
    <div class="card mt-3" v-for="post in posts" :key="post.id">
      <div class="card-header">
        <div class="row">
          <div class="col-md-6 text-start">
            <h5>{{ post.category.name }}</h5>
          </div>
          <div class="col-md-6 text-end">
            <h5>{{ post.region.name }}</h5>
          </div>
        </div>
      </div>
      <div class="card-body text-start">
        <p class="card-text">
          {{ post.content }}
        </p>
      </div>
      <div class="card-footer">
        <div class="row">
          <div class="col-md-6 text-start">
            <h5>{{ dateTime(post.created_at) }}</h5>
          </div>
          <div class="col-md-6 text-end">
            <div class="dropdown">
              <a
                class="btn btn-secondary dropdown-toggle"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Leer más en:
              </a>

              <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li v-for="links in post.links" :key="links.id">
                  <a class="dropdown-item" :href="links.url">{{
                    links.name
                  }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      posts: [],
    };
  },
  created() {
    this.getPosts();
  },
  methods: {
    getPosts() {
      this.axios
        .get("http://127.0.0.1:8000/api/posts")
        .then((response) => {
          this.posts = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dateTime(value) {
      let today = moment().startOf("day")
      let yesterday = moment().subtract(1, "days").startOf("day")

      if (moment(value).isSame(today, "d")) {
        return moment(value).format("[Hoy,] h:mm a")
      } else if (moment(value).isSame(yesterday, "d")) {
        return moment(value).format("[Ayer,] h:mm a")
      } else {
        return moment(value).format("D/MMMM/YYYY, h:mm a")
      }

      //return moment().startOf(value).fromNow();
    },
  },
};
</script>
