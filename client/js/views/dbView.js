class DbView {
  constructor() {
    this.form = document.querySelector(".form");
    this.formList = document.querySelector(".form__list");
  }

  logInOut(btnLogInOut, isLogin) {
    if (isLogin) {
      btnLogInOut.textContent = "Log out";
    } else {
      btnLogInOut.textContent = "Log in";
    }
  }

  renderAllPosts(idColections) {
    console.log(idColections);
    console.log(idColections[0].id);
    idColections[0].id?.forEach((obj) => this.renderSinglePosts(obj));
  }

  renderSinglePosts(obj) {
    console.log(obj);
    const html = `<li class="form__item">
    <input class="form__radio" type="radio" name="option" id="${obj.id}">
    <label class="form__label" for="${obj.id}">
      ${obj.namecollection}
      </label>
      <button class="form__delete">
         <img src="assets/delete.png" class="form__delete-icon" alt="Delete icon">
      </button>
    </li>`;
    this.formList.insertAdjacentHTML("afterbegin", html);
  }

  handleActivePosts(handleActivePostsCallback) {
    this.form.addEventListener("click", (e) => {
      // e.preventDefault();
      if (e.target.type === "radio" && e.target.checked) {
        console.log(e.target.id);
        handleActivePostsCallback(e.target.id);
      }
    });
  }

  clearSidebarForm() {
    this.formList.textContent = "";
  }

  deleteActivePosts(element) {
    element.remove();
  }
}

export default new DbView();
