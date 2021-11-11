
module.exports = (sequelize, DataTypes) => sequelize.define(
    "user",
    {
        // 스키마 정의
        uid: {
            // column 이름
            type: DataTypes.STRING,
            allowNull: false, // null 허용 설정
            unique: true
        },
        upw: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        nickname: {
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
        
    },
    {
        // 테이블 옵션
        timestamps: true,
        underscored: true,
        paranoid: true,
        tableName: 'user'
    }
    );
