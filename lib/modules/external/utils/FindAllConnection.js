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
const lodash_1 = require("lodash");
const typeorm_1 = require("typeorm");
const typeorm_cursor_connection_1 = require("typeorm-cursor-connection");
class FindAllConnection extends typeorm_cursor_connection_1.EntityConnection {
    constructor() {
        super(...arguments);
        this.totalCount = null;
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
    resolveCursor(item) {
        const key = this.sortOptions.map(({ sort }) => {
            if (sort.indexOf('->') === -1) {
                return item[sort.replace(/^\"/, '').replace(/\"$/, '')];
            }
            const path = sort
                .split('->')
                .slice(1)
                .map(n => n.substr(1, n.length - 2))
                .join('.');
            return lodash_1.get(item, `data.${path}`);
        });
        return Buffer.from(JSON.stringify(key)).toString('base64');
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
                queryBuilder.addOrderBy(sort, appliedOrderMap[order]);
            }
            if (this.limit) {
                queryBuilder.limit(this.limit);
            }
            const result = yield queryBuilder.getRawAndEntities();
            if (reverse) {
                result.entities.reverse();
            }
            result.raw.forEach((item, i) => {
                result.entities[i].locales = item.locales;
            });
            return result.entities;
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
                        const paramterName = Buffer.from(`${direction}__${sort}`).toString('hex');
                        let realSort = sort;
                        // allow JSONB sorting
                        if (sort.indexOf('->') >= 0) {
                            const arrowSort = sort.slice(0).split('->');
                            const lastSort = arrowSort.pop();
                            realSort = `${arrowSort.join('->')}->>${lastSort}`;
                        }
                        let equality;
                        if (j === i) {
                            equality = order === 'ASC' ? eq[0] : eq[1];
                        }
                        else {
                            equality = order === 'ASC' ? eq[2] : eq[3];
                        }
                        qb.andWhere(`${realSort} ${equality} :${paramterName}`, {
                            [paramterName]: cursorKey,
                        });
                    }
                });
                rootQb.orWhere(subKeySetComparison);
            }
        });
    }
}
exports.FindAllConnection = FindAllConnection;
//# sourceMappingURL=FindAllConnection.js.map