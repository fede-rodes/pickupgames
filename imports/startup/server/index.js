// Import your server-side configs
import './config.js';
import './startup.js';
import './accounts.js';

// Import all your server-side collections
import '../../api/markers/collection.js';
import '../../api/posts-system/collection.js';

// Import all your server-side methods
import '../../api/users/methods.js';
import '../../api/users/server/methods.js';
import '../../api/markers/methods.js';
import '../../api/posts-system/methods.js';
import '../../api/google-maps/server/methods.js';

// Import all your publications
import '../../api/users/server/publications.js';
import '../../api/markers/server/publications.js';
import '../../api/posts-system/server/publications.js';
