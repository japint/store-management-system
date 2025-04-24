class ItemService {
  constructor(context) {
    /** @type {{ itemStore: import('./store'), logStore: import('../logs/store') }} */
    const { itemStore, logStore } = context;
    this.itemStore = itemStore;
    this.logStore = logStore;
  }

  async get(id) {
    return await this.itemStore.get(id);
  }

  async list() {
    return await this.itemStore.list();
  }

  async create(item) {
    await this.logStore.create("item-created", item, 1);
    return await this.itemStore.create(item);
  }

  async update(id, item) {
    await this.logStore.create("item-updated", item, 1);
    return await this.itemStore.update(id, item);
  }

  async delete(id) {
    await this.logStore.create("item-deleted", { id }, 1);
    return await this.itemStore.delete(id);
  }

  async setEnable(enabled) {
    return await this.itemStore.setEnable(enabled);
  }
}

module.exports = ItemService;
