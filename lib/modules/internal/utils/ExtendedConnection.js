"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const typeorm_cursor_connection_1 = require("typeorm-cursor-connection");
class ExtendedConnection extends typeorm_cursor_connection_1.EntityConnection {
    constructor(args, options) {
        super(args, options);
        this.options = options;
        this.totalCountField = 'id';
        this.skip = args.skip;
    }
    get totalCount() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.createAppliedQueryBuilder(true)
                .select(`COUNT(DISTINCT "${this.totalCountField}")`, 'cnt')
                .getRawOne();
            resolve((result && result.cnt) || 0);
        }));
    }
    createAppliedQueryBuilder(counter = false) {
        const queryBuilder = this.repository.createQueryBuilder();
        if (this.where) {
            this.where(queryBuilder, counter);
        }
        if (this.afterSelector) {
            queryBuilder.andWhere(this.afterSelector);
        }
        if (this.beforeSelector) {
            queryBuilder.andWhere(this.beforeSelector);
        }
        return queryBuilder;
    }
    query() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sortOptions } = this;
            const queryBuilder = this.createAppliedQueryBuilder();
            const reverse = typeof this.args.last === 'number';
            const appliedOrderMap = {
                ASC: reverse ? 'DESC' : 'ASC',
                DESC: reverse ? 'ASC' : 'DESC',
            };
            queryBuilder.orderBy();
            for (const { sort, order } of sortOptions) {
                queryBuilder.addOrderBy(`"${sort}"`, appliedOrderMap[order]);
            }
            if (this.skip) {
                queryBuilder.offset(this.skip);
            }
            if (this.limit) {
                queryBuilder.limit(this.limit);
            }
            const entities = yield queryBuilder.getMany();
            if (reverse) {
                entities.reverse();
            }
            return entities;
        });
    }
    keyToSelector(key, direction) {
        const eq = direction === 'after' ? ['>', '<', '>=', '<='] : ['<', '>', '<=', '>='];
        const { sortOptions } = this.options;
        return new typeorm_1.Brackets(rootQb => {
            for (let i = 0; i < sortOptions.length; i++) {
                const subKeySetComparison = new typeorm_1.Brackets(qb => {
                    const subKeySet = key.slice(0, i + 1);
                    for (let j = 0; j < subKeySet.length; j++) {
                        const { sort, order } = sortOptions[j];
                        const cursorKey = subKeySet[j];
                        const paramterName = `${direction}__${sort}`;
                        let equality;
                        if (j === i) {
                            equality = order === 'ASC' ? eq[0] : eq[1];
                        }
                        else {
                            equality = order === 'ASC' ? eq[2] : eq[3];
                        }
                        qb.andWhere(`"${sort}" ${equality} :${paramterName}`, { [paramterName]: cursorKey });
                    }
                });
                rootQb.orWhere(subKeySetComparison);
            }
        });
    }
}
exports.ExtendedConnection = ExtendedConnection;
//# sourceMappingURL=ExtendedConnection.js.map