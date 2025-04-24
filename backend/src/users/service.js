class UserService {
  constructor(context) {
    /** @type {{ userStore: import('./store'), logStore: import('../logs/store') }} */
    const { userStore, logStore } = context;
    this.userStore = userStore;
    this.logStore = logStore;
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
