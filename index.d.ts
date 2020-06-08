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
  MESSAGING_QOS_EXACTLY_ONCE = 2,
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
  user_id?: string;
}

interface RegistrationCallbackInfo {
  response: string;
  userid: string;
}

type CbCallback<T> = (error: boolean, response: T) => void;

type LoginUserCallbackInfo = APIUser | string;

interface Column {
  ColumnName: string;
  ColumnType: string;
  PK: boolean;
}

interface InvocationContext {
  invocationContext: any;
}

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
  user: APIUser;

  init(options: InitOptions): void;
  setUser(email: string, password: string): void;
  registerUser(
    email: string,
    password: string,
    callback: CbCallback<RegistrationCallbackInfo>
  ): void;
  isCurrentUserAuthenticated(callback: CbCallback<boolean>): void;
  logoutUser(callback: CbCallback<APIUser>): void;
  loginAnon(callback: CbCallback<APIUser>): void;
  loginUser(
    email: string,
    password: string,
    callback: CbCallback<LoginUserCallbackInfo>
  ): void;
  loginUserMqtt(
    email: string,
    password: string,
    callback: CbCallback<any>
  ): void;
  registerMasterCallback(callback: CbCallback<InvocationContext>): void;
  Collection<T extends object>(
    options: string | CollectionOptionsWithName | CollectionOptionsWithID
  ): Collection<T>;
  Query(): QueryObj;
  Query(options: string | QueryOptionsWithName | QueryOptionsWithID): QueryObj;
  Item<T extends object>(data: T, collectionID: string | ItemOptions): Item<T>;
  Code(): Code;
  User(): AppUser;
  Messaging(
    options: MessagingOptions,
    callback: CbCallback<InvocationContext>
  ): Messaging;
  MessagingStats(): MessagingStats;
  sendPush(
    users: string[],
    payload: object,
    appId: string,
    callback: CbCallback<any>
  ): void;
  getEdges(callback: CbCallback<EdgeModel>): void;
  getEdges(query: QueryObj, callback: CbCallback<EdgeModel>): void;
  Edge(): Edge;
  Metrics(): Metrics;
  Device(): Device;
  Analytics(): Analytics;
  Portal(name: string): Portal;
  Triggers(): Triggers;
  Roles(): RoleAPI;
  UserManagement(): UserManagementAPI;
  getAllCollections(callback: CbCallback<CollectionData[]>): void;
}
interface CollectionOptionsWithName {
  collectionName: string;
}

interface CollectionOptionsWithID {
  collectionID: string;
}

interface CountCallbackInfo {
  count: number;
}

interface CollectionData {
  appID: string;
  name: string;
}

interface Collection<T extends object> {
  name: string;
  endpoint: string;
  isUsingCollectionName: boolean;
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  fetch(
    query: QueryObj | CbCallback<Item<T>[]>,
    callback: CbCallback<Item<T>[]>
  ): void;
  fetch(callback: CbCallback<Item<T>[]>): void;
  create(
    newItem: Partial<T> | Array<Partial<T>>,
    callback: CbCallback<Item<T>[]>
  ): void;
  update(query: QueryObj, changes: object, callback: CbCallback<string>): void;
  remove(query: QueryObj, callback: CbCallback<string>): void;
  columns(callback: CbCallback<Column[]>): void;
  count(query: QueryObj, callback: CbCallback<CountCallbackInfo>): void;
}

declare enum QuerySortDirections {
  QUERY_SORT_ASCENDING = "ASC",
  QUERY_SORT_DESCENDING = "DESC",
}
type ISortInfo = { [querySort in QuerySortDirections]: string };

declare enum QueryConditions {
  QUERY_EQUAL = "EQ",
  QUERY_NOTEQUAL = "NEQ",
  QUERY_GREATERTHAN = "GT",
  QUERY_GREATERTHAN_EQUAL = "GTE",
  QUERY_LESSTHAN = "LT",
  QUERY_LESSTHAN_EQUAL = "LTE",
  QUERY_MATCHES = "RE",
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
  SORT?: ISortInfo[];
  FILTERS?: QueryFilter[];
  PAGESIZE?: number;
  PAGENUM?: number;
}

interface QueryCallbackInfo {
  DATA: Object[];
  CURRENTPAGE: number;
  NEXTPAGEURL: number | null;
  PREVPAGEURL: number | null;
  TOTAL: number;
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
  ascending(field: string): QueryObj;
  descending(field: string): QueryObj;
  equalTo(field: string, value: QueryValue): QueryObj;
  greaterThan(field: string, value: QueryValue): QueryObj;
  greaterThanEqualTo(field: string, value: QueryValue): QueryObj;
  lessThan(field: string, value: QueryValue): QueryObj;
  lessThanEqualTo(field: string, value: QueryValue): QueryObj;
  notEqualTo(field: string, value: QueryValue): QueryObj;
  matches(field: string, pattern: RegExp | string): QueryObj;
  or(query: QueryObj): QueryObj;
  setPage(pageSize: number, pageNum: number): QueryObj;
  getFieldValue(field: string): object | null;
  fetch(callback: QueryCallbackInfo): void;
  update(changes: object, callback: CbCallback<string>): void;
  columns(columnsArray: string[]): void;
  remove(callback: CbCallback<string>): void;
}

interface ItemOptions extends CollectionOptionsWithID {}

interface Item<T extends object> {
  data: T;

  save(callback: CbCallback<any>): void;
  refresh(callback: CbCallback<any>): void;
  destroy(callback: CbCallback<any>): void;
}

interface ServicePayload {
  code: string;
  parameters: string[];
  name: string;
  dependencies: string;
}

interface ServiceCallbackInfo<T> {
  logs?: string;
  results: string;
  success: boolean;
}

interface CodeCreationInfo {
  created: boolean;
  name: string;
  uri: string;
}

interface CodeUpdateInfo {
  uri: string;
  version_number: number;
}

interface ServiceError {
  status_code: number;
  error: object;
}

interface ServiceInfo {
  Service: string;
  Args: any[];
  Response: ServiceCallbackInfo<unknown>;
  Error: ServiceError;
  UserId: string;
  UserType: number;
  Id: string;
  Datetime: string;
}

interface AllServicesRequest {
  code: string[];
}

interface Code {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;
  callTimeout: number;

  create(
    name: string,
    body: ServicePayload,
    callback: CbCallback<CodeCreationInfo>
  ): void;
  update(
    name: string,
    body: ServicePayload,
    callback: CbCallback<CodeUpdateInfo>
  ): void;
  delete(name: string, callback: CbCallback<any>): void;
  execute<T>(
    name: string,
    params: object,
    callback: CbCallback<ServiceCallbackInfo<T>>
  ): void;
  getCompletedServices(callback: CbCallback<ServiceInfo>): void;
  getFailedServices(callback: CbCallback<ServiceInfo>): void;
  getAllServices(callback: CbCallback<AllServicesRequest>): void;
}

interface AppUserData {
  email: string;
  user_id: string;
  creation_date: string;
}

interface AppUserList {
  Data: AppUserData[];
  Total: number;
}

interface AppUser {
  user: APIUser;
  URI: string;
  endpoint: string;
  systemKey: string;
  systemSecret: string;
  callTimeout: number;

  getUser(callback: CbCallback<AppUserData>): void;
  setUser(data: object, callback: CbCallback<string>): void;
  allUsers(query: QueryObj, callback: CbCallback<AppUserList>): void;
  setPassword(
    old_password: string,
    new_password: string,
    callback: CbCallback<string>
  ): void;
  count(query: QueryObj, callback: CbCallback<CountCallbackInfo>): void;
  addUser(data: object, callback: CbCallback<any>): void;
  updateUser(data: object, callback: CbCallback<any>): void;
  deleteUser(data: object, callback: CbCallback<any>): void;
  columns(callback: CbCallback<Column[]>): void;
}

interface Messaging {
  user: APIUser;
  URI: string;
  endpoint: string;
  systemKey: string;
  systemSecret: string;
  callTimeout: number;
  client: Paho.MQTT.Client;

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
  maxConnectRetries?: number;
}

interface MessagingConfiguration extends CommonMessagingProperties {
  userName: string;
  password: string;
}

type MessageCallback = (
  messagePayload: string,
  message: Paho.MQTT.Message
) => void;

interface MessagingSubscribeOptions {
  qos?: MessagingQOS;
  invocationContext?: object;
  onSuccess?: Function;
  onFailure?: Function;
  timeout?: number;
}

type TopicsList = string[];

interface MessageInfo {
  id: string;
  message: string;
  "send-date": number;
  topicid: string;
  "user-id": string;
}

type MessageCallbackInfo = MessageInfo[] | string;

interface IPayloadSize {
  payloadsize: number;
}

interface ISubcribers {
  subscribers: number;
}

interface IConnections {
  connections: number;
}

interface MessagingStats {
  user: APIUser;
  URI: string;
  endpoint: string;
  systemKey: string;
  callTimeout?: number;

  getMessageHistoryWithTimeFrame(
    topic: string,
    count: number,
    last: number,
    start: number,
    stop: number,
    callback: CbCallback<MessageCallbackInfo>
  ): void;
  getMessageHistory(
    topic: string,
    last: number,
    count: number,
    callback: CbCallback<MessageCallbackInfo>
  ): void;
  getAndDeleteMessageHistory(
    topic: string,
    count: number,
    last: number,
    start: number,
    stop: number,
    callback: CbCallback<MessageCallbackInfo>
  ): void;
  currentTopics(callback: CbCallback<TopicsList>): void;
  getAveragePayloadSize(
    topic: string,
    start: number,
    stop: number,
    callback: CbCallback<IPayloadSize>
  ): void;
  getOpenConnections(callback: CbCallback<IConnections>): void;
  getCurrentSubscribers(topic: string, callback: CbCallback<ISubcribers>): void;
}

interface EdgeModel {
  broker_auth_port: string;
  broker_port: string;
  broker_tls_port: string;
  broker_ws_auth_port: string;
  broker_ws_port: string;
  broker_wss_port: string;
  communication_style: string;
  description: string;
  edge_key: string;
  first_talked: string;
  isConnected: boolean;
  last_seen_version: string;
  last_talked: number;
  local_addr: string;
  local_port: string;
  location: string;
  mac_address: string;
  name: string;
  novi_system_key: string;
  policy_name: string;
  public_addr: string;
  public_port: string;
  resolver_func: string;
  sync_edge_tables: string;
  system_key: string;
  system_secret: string;
  token: string;
}

interface EdgeUpdateInfo {
  description: string;
  edge_key: string;
  name: string;
  novi_system_key: string;
}

interface Edge {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  updateEdgeByName(
    name: string,
    object: object,
    callback: CbCallback<EdgeUpdateInfo>
  ): void;
  deleteEdgeByName(name: string, callback: CbCallback<any>): void;
  create(
    newEdge: object,
    name: string,
    callback: CbCallback<EdgeUpdateInfo>
  ): void;
  columns(callback: CbCallback<Column[]>): void;
  count(query: QueryObj, callback: CbCallback<CountCallbackInfo>): void;
}

interface Metrics {
  user: APIUser;
  URI: string;
  systemKey: string;

  setQuery(query: QueryObj): void;
  getStatistics(callback: CbCallback<QueryCallbackInfo>): void;
  getStatisticsHistory(callback: CbCallback<QueryCallbackInfo>): void;
  getDBConnections(callback: CbCallback<QueryCallbackInfo>): void;
  getLogs(callback: CbCallback<QueryCallbackInfo>): void;
}

interface DeviceSuccessCallbackInfo {
  success: boolean;
}

interface DeviceModel {
  allow_certificate_auth: boolean;
  allow_key_auth: boolean;
  certificate: string;
  created_date: number;
  description: string;
  device_key: string;
  enabled: boolean;
  last_active_date: number;
  name: string;
  state: string;
  system_key: string;
  type: string;
  [other: string]: any;
}

interface Device {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  getDeviceByName(name: string, callback: CbCallback<DeviceModel>): void;
  updateDeviceByName(
    name: string,
    object: object,
    trigger: boolean,
    callback: CbCallback<DeviceModel>
  ): void;
  deleteDeviceByName(name: string, callback: CbCallback<any>): void;
  fetch(query: QueryObj, callback: CbCallback<DeviceModel[]>): void;
  update(
    query: QueryObj,
    object: object,
    trigger: boolean,
    callback: CbCallback<DeviceSuccessCallbackInfo>
  ): void;
  delete(
    query: QueryObj,
    callback: CbCallback<DeviceSuccessCallbackInfo>
  ): void;
  create(newDevice: object, callback: CbCallback<DeviceModel>): void;
  columns(callback: CbCallback<Column[]>): void;
  count(query: QueryObj, callback: CbCallback<CountCallbackInfo>): void;
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

interface PortalModel {
  config: string;
  description: string;
  last_updated: string;
  name: string;
  system_key: string;
  type: object;
}

interface Portal {
  name: string;
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  fetch(callback: CbCallback<PortalModel>): void;
  update(data: object, callback: CbCallback<PortalModel>): void;
}

interface TriggerDefinition {
  def_module: string;
  def_name: string;
  def_keys: string[];
}

interface TriggerModel {
  system_key: string;
  system_secret: string;
  name: string;
  event_definition: {
    def_module: string;
    def_name: string;
    def_keys: string[];
    visibility: boolean;
  };
  key_value_pairs: object;
  service_name: string;
}

interface Triggers {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  fetchDefinitions(callback: CbCallback<TriggerDefinition[]>): void;
  create(name: string, data: object, callback: CbCallback<TriggerModel>): void;
  update(name: string, data: object, callback: CbCallback<TriggerModel>): void;
  delete(name: string, callback: CbCallback<any>): void;
}

interface Role {
  ID: string;
  Name: string;
  Description: string;
}

interface FetchRolesOptions {
  user?: string;
  device?: string;
  query?: QueryObj;
}

interface CreateRolePayload {
  name: string;
  description: string;
  collections: {}[];
  topics: {}[];
  services: {}[];
  servicecaches: {}[];
}

interface RoleAPI {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  create(
    role: CreateRolePayload,
    callback: CbCallback<{ role_id: string }>
  ): void;
  update(id: string, changes: object, callback: CbCallback<any>): void;
  fetch(options: FetchRolesOptions, callback: CbCallback<Role[]>): void;
  fetch(callback: CbCallback<Role[]>): void;
  delete(roleId: string, callback: CbCallback<undefined>): void;
}

interface UpdateUserPayload {
  user: string;
  changes: {
    password?: string;
    roles?: {
      add: string[];
      delete: string[];
    };
  };
}

interface UserManagementAPI {
  user: APIUser;
  URI: string;
  systemKey: string;
  systemSecret: string;

  update(body: UpdateUserPayload, callback: CbCallback<undefined>): void;
}

declare var ClearBlade: IClearBladeGlobal;
