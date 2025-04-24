const bcrypt = require("bcrypt");

class UserService {
  constructor(context) {
    /** @type {{ userStore: import('./store'), logStore: import('../logs/store') }} */
    const { userStore, logStore } = context;
    this.userStore = userStore;
    this.logStore = logStore;
  }

  async register({ uid, password, name }) {
    if (!uid || !password || !name) {
      throw new Error("uid, password and name are required");
    }

    const existingUser = await this.userStore.getUserByUid(uid);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await this.userStore.createUser({ uid, pw: hashedPassword, name });

    return {
      message: "User registered successfully",
      user: {
        uid,
        name,
      },
    };
  }

  async get(id) {
    return await this.userStore.get(id);
  }

  async list() {
    return await this.userStore.list();
  }

  async create(user) {
    await this.logStore.create("user-created", user, 1);
    return await this.userStore.create(user);
  }

  async update(id, user) {
    await this.logStore.create("user-updated", user, 1);
    return await this.userStore.update(id, user);
  }

  async delete(id) {
    await this.logStore.create("user-deleted", { id }, 1);
    return await this.userStore.delete(id);
  }

  async setEnable(enabled) {
    return await this.userStore.setEnable(enabled);
  }
}

module.exports = UserService;
