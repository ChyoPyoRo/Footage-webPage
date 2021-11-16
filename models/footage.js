
module.exports = (sequelize, DataTypes) => sequelize.define(
    "footage",
    {
        // 스키마 정의
        foot_name: {
            // column 이름
            type: DataTypes.STRING,
            allowNull: false // null 허용 설정
        },
        footcontent: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        deleted: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        uid:{
            type: DataTypes.STRING,
            allowNull : true
        },
        
    },
    {
        // 테이블 옵션
        timestamps: true,//createdAt, UpdatedAt에 시간값이 자동으로 들어가도록 해준다.
        underscored: true,
        paranoid: true,
        tableName: 'footage'
    }
);
