const db = require("../config/db.js");
const bcrypt = require("bcrypt");

module.exports = {
    getUser: async (params, result) => {
        let res;
        let isAgent = false;
    
        // DB에서 해당하는 사용자 정보 가져오기
        let rawQuery = `
        SELECT r_username, r_id, r_password FROM resident WHERE r_username = ?;
        `;
        res = await db.query(rawQuery, [params.username]);
    
        // 사용자가 아니라면 DB에서 해당하는 공인중개사 정보 가져오기
        if (res[0].length === 0) {
          let rawQuery2 = `
            SELECT a_username, a_id, a_password FROM agent WHERE a_username = ?;
            `;
          res = await db.query(rawQuery2, [params.username]);
          if (res[0].length === 0) return result(null);
    
          isAgent = true;
        }
    
        // 사용자/공인중개사 비밀번호 유효성 확인하기
        const passwordHash = isAgent ? res[0][0].a_password : res[0][0].r_password;
        const res2 = await bcrypt.compare(params.password, passwordHash);
        if (!res2) return result(null);
    
        result(isAgent ? res[0][0].a_username : res[0][0].r_username, isAgent);
      },
}