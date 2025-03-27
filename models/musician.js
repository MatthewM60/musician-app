class Musician {
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  async getMusicians(callback) {
    try {
      const [rows] = await this.db.execute('SELECT * FROM musicians');
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  }

  async getMusician(id, callback) {
    try {
      const [rows] = await this.db.execute(
        'SELECT * FROM musicians WHERE id = ?',
        [id]
      );
      callback(null, rows[0] || null);
    } catch (err) {
      callback(err, null);
    }
  }

  async putMusician(id, data, callback) {
    try {
      const [result] = await this.db.execute(
        'INSERT INTO musicians (id, first_name, last_name, genre) VALUES (?, ?, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE first_name = ?, last_name = ?, genre = ?',
        [id, data.firstName, data.lastName, data.genre, 
         data.firstName, data.lastName, data.genre]
      );
      callback(null, id);
    } catch (err) {
      callback(err, null);
    }
  }

  async deleteMusician(id, callback) {
    try {
      const [result] = await this.db.execute(
        'DELETE FROM musicians WHERE id = ?',
        [id]
      );
      callback(null, id);
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = Musician;