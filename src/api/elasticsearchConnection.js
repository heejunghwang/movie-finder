import ElasticsearchConfig from '../../config/elasticsearch.env.js'

/**
 * 엘라스틱 서치 연결을 위한 모듈
 * @type {es}
 */

const elasticsearch = require('elasticsearch');

const elasticsearchClient = new elasticsearch.Client({
  host: ElasticsearchConfig.elasticsearch_host,
  cors : true,
  keepAlive : false,
  // log: 'trace'
})

export default elasticsearchClient;
