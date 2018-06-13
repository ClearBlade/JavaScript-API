// Type definitions for clearbladejs-client 1.0
// Project: https://github.com/ClearBlade/JavaScript-API
// Definitions by: Jim Bouquet <https://github.com/ClearBlade>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

/// <reference types="paho-mqtt" />

// TODO: change all the occurences where we use CbCallback<any> to supply the actual type that is returned

declare enum MessagingQOS {
  MESSAGING_QOS_AT_MOST_ONCE = 0,
  MESSAGING_QOS_AT_LEAST_ONCE = 1,
  MESSAGING_QOS_EXACTLY_ONCE = 2
}

interface InitOptions {
  systemKey: string;
  systemSecret: string;
  masterSecret?: string;
  logging?: boolean;
  callback?: CbCallback<any>;
  email?: string;
  password?: string;
  registerUser?: boolean;
  useUser?: APIUser;
  URI?: string;
  messagingURI?: string;
  messagingPort?: number;
  defaultQoS?: MessagingQOS;
  callTimeout?: number;
  messagingAuthPort?: number;
}

interface RequestOptions {
  method?: string;
  endpoint?: string;
  body?: string;
  qs?: string;
  URI?: string;
  useUser?: boolean;
  authToken?: string;
  timeout?: number;
  user?: APIUser;
}

interface APIUser {
  email: string;
  authToken: string;
}

type CbCallback<T> = (error: boolean, response: T) => void;

interface IClearBladeGlobal {
  new (): IClearBlade;

  MESSAGING_QOS_AT_MOST_ONCE: MessagingQOS.MESSAGING_QOS_AT_MOST_ONCE;
  MESSAGING_QOS_AT_LEAST_ONCE: MessagingQOS.MESSAGING_QOS_AT_LEAST_ONCE;
  MESSAGING_QOS_EXACTLY_ONCE: MessagingQOS.MESSAGING_QOS_EXACTLY_ONCE;

  request(options: RequestOptions, callback: CbCallback<any>): void;
}

interface IClearBlade {
  systemKey: string;
  systemSecret: string;
  masterSecret: string;
  URI: string;
  messagingURI: string;
  messagingPort: number;
  logging: boolean;
  defaultQoS: MessagingQOS;

  init(options: InitOptions): void;
  setUser(email: string, password: string): void;
  registerUser(
    email: string,
    password: string,
    callback: CbCallback<any>
  ): void;
  isCurrentUserAuthenticated(callback: CbCallback<any>): void;
  logoutUser(callback: CbCallback<any>): void;
  loginAnon(callback: CbCallback<any>): void;
  loginUser(email: string, password: string, callback: CbCallback<any>): void;
  loginUserMqtt(
    email: string,
    password: string,
    callback: CbCallback<any>
  ): void;
  registerMasterCallback(callback: CbCallback<any>): void;
  Collection(
    options: string | CollectionOptionsWithName | CollectionOptionsWithID
  ): Collection;
  Query(): QueryObj;
  Query(options: string | QueryOptionsWithName | QueryOptionsWithID): QueryObj;
  Item(data: object, collectionID: string | ItemOptions): Item;
  Code(): Code;
  User(): AppUser;
  Messaging(options: MessagingOptions, callback: CbCallback<any>): Messaging;
  MessagingStats(): MessagingStats;
  sendPush(
    users: string[],
    payload: object,
    appId: string,
    callback: CbCallback<any>
  ): void;
  getEdges(callback: CbCallback<any>): void;
  getEdges(query: Query, callback: CbCallback<any>): void;
  Edge(): Edge;
  Metrics(): Metrics;
  Device(): Device;
  Analytics(): Analytics;
  Portal(name: string): Portal;
  Triggers(): Triggers;

  getAllCollections(callback: CbCallback<any>): void;
}
interface CollectionOptionsWithName {
  collectionName: string;
}

interface CollectionOptionsWithID {
  collectionID: string;
}

interface Collection {
  name: string;
  endpoint: string;
  isUsingCollectionName: boolean;
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  fetch(
    query: QueryObj | CbCallback<Item[]>,
    callback?: CbCallback<Item[]>
  ): void;
  create(newItem: Item, callback: CbCallback<any>): void;
  update(query: QueryObj, changes: object, callback: CbCallback<any>): void;
  remove(query: QueryObj, callback: CbCallback<any>): void;
  columns(callback: CbCallback<any>): void;
  count(query: QueryObj, callback: CbCallback<any>): void;
}

declare enum QuerySortDirections {
  QUERY_SORT_ASCENDING = "ASC",
  QUERY_SORT_DESCENDING = "DESC"
}

declare enum QueryConditions {
  QUERY_EQUAL = "EQ",
  QUERY_NOTEQUAL = "NEQ",
  QUERY_GREATERTHAN = "GT",
  QUERY_GREATERTHAN_EQUAL = "GTE",
  QUERY_LESSTHAN = "LT",
  QUERY_LESSTHAN_EQUAL = "LTE",
  QUERY_MATCHES = "RE"
}

type QueryValue = string | number | boolean;

interface QueryOptions {
  offset?: number;
  limit?: number;
}

interface QueryOptionsWithName
  extends CollectionOptionsWithName,
    QueryOptions {}
interface QueryOptionsWithID extends CollectionOptionsWithID, QueryOptions {}

interface Query {
  SELECTCOLUMNS?: string[];
  SORT?: QuerySortDirections;
  FILTERS?: QueryFilter[];
  PAGESIZE?: number;
  PAGENUM?: number;
}

interface QueryFilter {
  [QueryConditions: string]: QueryFilterValue;
}

interface QueryFilterValue {
  [name: string]: QueryValue;
}

interface QueryObj {
  endpoint: string;
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;
  query: Query;
  OR: Query[];
  offset: number;
  limit: number;

  addSortToQuery(
    query: QueryObj,
    direction: QuerySortDirections,
    column: string
  ): void;
  addFilterToQuery(
    query: QueryObj,
    condition: QueryConditions,
    key: string,
    value: QueryValue
  ): void;
  ascending(field: string): void;
  descending(field: string): void;
  equalTo(field: string, value: QueryValue): void;
  greaterThan(field: string, value: QueryValue): void;
  greaterThanEqualTo(field: string, value: QueryValue): void;
  lessThan(field: string, value: QueryValue): void;
  lessThanEqualTo(field: string, value: QueryValue): void;
  notEqualTo(field: string, value: QueryValue): void;
  matches(field: string, pattern: RegExp): void;
  or(query: QueryObj): void;
  setPage(pageSize: number, pageNum: number): void;
  fetch(callback: CbCallback<any>): void;
  update(changes: object, callback: CbCallback<any>): void;
  columns(columnsArray: string[]): void;
  remove(callback: CbCallback<any>): void;
}

interface ItemOptions extends CollectionOptionsWithID {}

interface Item {
  data: object;

  save(callback: CbCallback<any>): void;
  refresh(callback: CbCallback<any>): void;
  destroy(callback: CbCallback<any>): void;
}

interface Code {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;
  callTimeout: number;

  create(name: string, body: string, callback: CbCallback<any>): void;
  update(name: string, body: string, callback: CbCallback<any>): void;
  delete(name: string, callback: CbCallback<any>): void;
  execute(name: string, params: object, callback: CbCallback<any>): void;
  getCompletedServices(callback: CbCallback<any>): void;
  getFailedServices(callback: CbCallback<any>): void;
  getAllServices(callback: CbCallback<any>): void;
}

interface AppUser {
  user: APIUser;
  URI: string;
  endpoint: string;
  systemKey: string;
  systemSecret: string;
  callTimeout: number;

  getUser(callback: CbCallback<any>): void;
  setUser(data: object, callback: CbCallback<any>): void;
  allUsers(query: Query, callback: CbCallback<any>): void;
  setPassword(
    old_password: string,
    new_password: string,
    callback: CbCallback<any>
  ): void;
  count(query: Query, callback: CbCallback<any>): void;
}

interface Messaging {
  user: APIUser;
  URI: string;
  endpoint: string;
  systemKey: string;
  systemSecret: string;
  callTimeout: number;
  client: Paho.MQTT.Client;

  getMessageHistoryWithTimeFrame(
    topic: string,
    count: number,
    last: number,
    start: number,
    stop: number,
    callback: CbCallback<any>
  ): void;
  getMessageHistory(
    topic: string,
    last: number,
    count: number,
    callback: CbCallback<any>
  ): void;
  getAndDeleteMessageHistory(
    topic: string,
    count: number,
    last: number,
    start: number,
    stop: number,
    callback: CbCallback<any>
  ): void;
  currentTopics(callback: CbCallback<any>): void;
  publish(topic: string, payload: object): void;
  publishREST(topic: string, payload: object, callback: CbCallback<any>): void;
  subscribe(
    topic: string,
    options: MessagingSubscribeOptions,
    messageCallback: MessageCallback
  ): void;
  unsubscribe(topic: string, options: MessagingSubscribeOptions): void;
  disconnect(): void;
}

interface CommonMessagingProperties {
  cleanSession?: boolean;
  useSSL?: boolean;
  hosts?: string;
  ports?: string;
  onSuccess?: Function;
  onFailure?: Function;
}

interface MessagingOptions extends CommonMessagingProperties {
  qos?: MessagingQOS;
}

interface MessagingConfiguration extends CommonMessagingProperties {
  userName: string;
  password: string;
}

type MessageCallback = (message: string) => void;

interface MessagingSubscribeOptions {
  qos?: MessagingQOS;
  invocationContext?: object;
  onSuccess?: Function;
  onFailure?: Function;
  timeout?: number;
}

interface MessagingStats {
  user: APIUser;
  URI: string;
  endpoint: string;
  systemKey: string;

  getAveragePayloadSize(
    topic: string,
    start: number,
    stop: number,
    callback: CbCallback<any>
  ): void;
  getOpenConnections(callback: CbCallback<any>): void;
  getCurrentSubscribers(topic: string, callback: CbCallback<any>): void;
}

interface Edge {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  updateEdgeByName(
    name: string,
    object: object,
    callback: CbCallback<any>
  ): void;
  deleteEdgeByName(name: string, callback: CbCallback<any>): void;
  create(newEdge: object, name: string, callback: CbCallback<any>): void;
  columns(callback: CbCallback<any>): void;
  count(query: Query, callback: CbCallback<any>): void;
}

interface Metrics {
  user: APIUser;
  URI: string;
  systemKey: string;

  setQuery(query: Query): void;
  getStatistics(callback: CbCallback<any>): void;
  getStatisticsHistory(callback: CbCallback<any>): void;
  getDBConnections(callback: CbCallback<any>): void;
  getLogs(callback: CbCallback<any>): void;
}

interface Device {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  getDeviceByName(name: string, callback: CbCallback<any>): void;
  updateDeviceByName(
    name: string,
    object: object,
    trigger: boolean,
    callback: CbCallback<any>
  ): void;
  deleteDeviceByName(name: string, callback: CbCallback<any>): void;
  fetch(query: Query, callback: CbCallback<any>): void;
  update(
    query: Query,
    object: object,
    trigger: boolean,
    callback: CbCallback<any>
  ): void;
  delete(query: Query, callback: CbCallback<any>): void;
  create(newDevice: object, callback: CbCallback<any>): void;
  columns(callback: CbCallback<any>): void;
  count(query: Query, callback: CbCallback<any>): void;
}

interface Analytics {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  getStorage(filter: QueryFilter, callback: CbCallback<any>): void;
  getCount(filter: QueryFilter, callback: CbCallback<any>): void;
  getEventList(filter: QueryFilter, callback: CbCallback<any>): void;
  getEventTotals(filter: QueryFilter, callback: CbCallback<any>): void;
  getUserEvents(filter: QueryFilter, callback: CbCallback<any>): void;
}

interface Portal {
  name: string;
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  fetch(callback: CbCallback<any>): void;
  update(data: object, callback: CbCallback<any>): void;
}

interface Triggers {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  fetchDefinitions(callback: CbCallback<any>): void;
  create(name: string, data: object, callback: CbCallback<any>): void;
  update(name: string, data: object, callback: CbCallback<any>): void;
  delete(name: string, callback: CbCallback<any>): void;
}

declare var ClearBlade: IClearBladeGlobal;
