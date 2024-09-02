export default function query(db,table_name,cb) {
  return new Promise(function (suc) {
    db.query({
      tableName: table_name,
      condition: cb,
      success: r => {
       suc(r)
        }
      })
    })
}
