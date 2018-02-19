import ElasticsearchConfig from '../../config/elasticsearch.env.js'

const elasticsearch = require('elasticsearch');

/**
 * Elasticsearch Client API
 */

/**
 * 엘라스틱 서치 클라이언트 객체를 가져온다.
 * @type {elasticsearch.Client}
 */
const elasticsearchClient = new elasticsearch.Client({
  host: ElasticsearchConfig.elasticsearch_host,
  cors : true,
  keepAlive : false,
  // log: 'trace'
})

export default elasticsearchClient;
