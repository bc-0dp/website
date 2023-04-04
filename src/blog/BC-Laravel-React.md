---
title: Bigcommerce App using Laravel and React
description: Setting up a sample application with Laravel and React to interface with BigCOmmerce
date: 2023-02-27
---

This tutorial will walk you though the steps to get a functional application using Laravel on the backend and React on the frontend up and running.
It's purpose is to fast-track your understanding of what it takes to quickly build a BigCommerce application using approachable, modern frameworks.

At the end, you will have a basic two-screen application with routing. You can run it locally, or install on your BigCommerce store.
Run API requests, display the results, and make actions.

## Prerequisites
Before jumping in, you’ll want to make sure you have installed the following dependencies on your dev machine:

- PHP ([Installation Guide](https://www.php.net/manual/en/install.php))
- Composer ([Installation Guide](https://getcomposer.org/doc/00-intro.md))
- Laravel ([Installation Guide](https://laravel.com/docs/10.x))
- Local SSL Cert (Recommend Valet or Homestead to ease set up)

To ease PHP development and enable the app you develop to be easily shared, you’ll want to use either Valet or Homestead, depending on your OS:

  - Mac OS: Valet ([Installation Guide](https://laravel.com/docs/10.x/valet))
  - Windows / Linux: Homestead ([Installation Guide](https://laravel.com/docs/10.x/homestead))

We’ll be using Valet for some of the steps below, but the functionality to host and share sites is similar across both Valet and Homestead. What’s more important in this tutorial is how to configure Laravel to use React and connect with BigCommerce.

## Step 1: Getting Laravel and React Running Together
This is where we will create a baseline for future development: a simple application that loads at a specific URL in your browser and loads a React component instead of the default Laravel screen.

### Create a new Laravel codebase
You can either use the Laravel command that creates the initial boilerplate for an app in the ~/Sites directory or use Composer:

```bash
composer global require laravel/installer
laravel new laravel-react-bigcommerce-app
```
or
```bash
composer create-project laravel/laravel laravel-react-bigcommerce-app
```

You should see the command run its course, like this:

![Compsoer create-project](/assets/images/Composer-install.png)

### Visit the app address to make sure it’s live locally
After the command above completes, we wiil need to set up the directory so Valet can serve the app securely.
```bash
cd laravel-react-bigcommerce-app
valet link
valet secure
```

You should now be able to visit the following URL in your browser and see the default Laravel welcome screen:

https://laravel-react-bigcommerce-app.test

![Laravel Welcome Screen](/assets/images/Laravel-welcome.png)

### Set up React as the JS framework using Breeze and Inertia
Larvel Breeze provides a minimal and simple starting point for building a Laravel application, with authentication features.
It's powered by Blade and Tailwind but can be configured as an SPA using Inertia.
In this example we will power our frontend with react.

First let's install Breeze:
```bash
composer require laravel/breeze --dev
```

Then we install the react scaffolding:
```bash
php artisan breeze:install react
```

Note: this last command executed `npm install` so no need to run this command.

Lastly, get the application running:

```bash
npm run dev
```
a `Local` url should now be available in your console to visit your react application

http://127.0.0.1:5173/

![Laravel React Welcome Screen](/assets/images/Laravel-react-welcome.png)


### References
https://laravel.com/docs/10.x/installation#your-first-laravel-project<br/>
https://laravel.com/docs/10.x/starter-kits

## Step 2: Set up a Basic App
Now that you are set up for React development with a Laravel back-end, you are ready to implement routes, pages, and navigation within the app.

### Routes
Open up `/routes/web.php` and edit it the file to reflect the following routes

```php
Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/list', function () {
    return Inertia::render('List');
});
```

---
**NOTE**

Breeze installs scaffolding for authentication routes to be used with your React app. You'll have to modify them if you intend to use these routes in the future, or replace them with above routes

---


### Pages
Create `/resources/js/Pages/Home.jsx`

```js
import Navigation from '@/Components/Navigation';

import { Head } from '@inertiajs/react';
import React from 'react';

export default class Home extends React.Component {
    render() {
        return (
            <>
                <Head title="Home" />
                <Navigation />

                <div className="container mx-auto p-5">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="content col-span-3 grid-col-3 rounded bg-gray-100 shadow-lg p-4">
                            <h2 className="text-xl font-bold mb-6">This is the Home Page.</h2>
                        </div>
                        <div className="sidebar rounded bg-gray-100 shadow-lg p-4">
                            <h2 className="text-xl font-bold mb-6">This is a Side Bar.</h2>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
```

Create  `/resources/js/Pages/List.jsx`

```js
import Navigation from '@/Components/Navigation';

import { Head } from '@inertiajs/react';
import React from 'react';

export default class List extends React.Component {
    render() {
        return (
            <>
                <Head title="Order List" />
                <Navigation />

                <div className="container mx-auto p-5">
                    <div className="content col-span-3 grid-col-3 rounded bg-gray-100 shadow-lg p-4">
                        <h2 className="text-xl font-bold mb-6">List of Orders</h2>
                    </div>
                </div>
            </>
        );
    }
}
```

### Navigation Component
When creating the two pages above you may have noticed we imported a navigation component. Let's create it!

Create `/resources/js/Components/Navigation.jsx`

```js
import { Link } from '@inertiajs/react';

export default function Navigation() {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-gray-500 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <ul className="flex">
                    <li className="mr-6">
                        <Link className="text-white hover:text-blue-800" href="/">Home</Link>
                    </li>
                    <li className="mr-6">
                        <Link className="text-white hover:text-blue-800" href="/list">List</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
```

### Chapter Summary
You should now have a working application with React, Routes, Pages, and Components.
Navigate to `https://laravel-react-bigcommerce-app.test` and you’ll now see a functional layout for an app, including navigation, appear!

## Step 3: Connect the App With BigCommerce
Alright, it’s time to start connecting the app to real data inside a BigCommerce store.

### Create app in BC dev tools area

Head to ([devtools.bigcommerce.com](https://devtools.bigcommerce.com)) and log in with your BigCommerce store account. Create an app and go to the ‘Technical’ step in them modal.

To start, you want at least the auth and load callback URLs to be set, since those are what BC will use to initiate the install process and enable the app to load within the BC control panel.

![BigCommerce AppPortal Callback URLs](/assets/images/callback.png)

After setting the callback URLs, you need to select which scopes your app will need. Keep track of this because your app will need to check the proper scopes have been granted when installed. If you were making a real app, you would only select what the app actually needs here, as BigCommerce will work to ensure you don’t have too many permissions.

![BigCommerce AppPortal App Scope](/assets/images/scope.png)

### Save your app’s client ID and secret
The client ID and Secret are used to verify that your app requests are valid. Save these into environment variables within your app. 
In the sample Laravel app, we’re saving these in the .env file along with the scopes so each piece of app info is able to be set in one place.

Update your .env file (in the root app directory) to have the APP_URL set as https://laravel-react-bigcommerce-app.test and add new env variables at the bottom of the file for your BC App IDs and test API credentials for local dev.

```bash
# Existing env variable. Make sure it matches the base URL of your app
APP_URL=https://laravel-react-bigcommerce-app.test

[ ... other existing variables ... ]

# New env variables for BC app and a test API credentials for local dev
# The Client ID and Secret can be found at https://devtools.bigcommerce.com/my/apps by selecting 'View Client ID'
BC_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BC_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# These local credentials can be created by creating an API Account within your BigCommerce store (Advanced Settings > API Accounts)
BC_LOCAL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BC_LOCAL_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BC_LOCAL_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BC_LOCAL_STORE_HASH=stores/xxxxxxxxxxx
```

### Set up the install, load and BC API proxy routes
When the app is installed, it will look to the callbacks that are defined in the dev tools area.

Add the web routes below, so Laravel knows to route to the specific controller methods for each callback.
We are implementing install and load here, to get the baseline experience working, however there are stubbed routes for future functionality like uninstall and remove-user too.

```php
Route::get('/{url?}', function () {
    return view('app');
})->where('', 'list');

Route::group(['prefix' => 'auth'], function () {
  Route::get('install', 'MainController@install');

  Route::get('load', 'MainController@load');

  Route::get('uninstall', function () {
    echo 'uninstall';
    return app()->version();
  });

  Route::get('remove-user', function () {
    echo 'remove-user';
    return app()->version();
  });
});

Route::any('/bc-api/{endpoint}', 'MainController@proxyBigCommerceAPIRequest')
  ->where('endpoint', 'v2\/.*|v3\/.*');
```

### Create a controller to handle app install and load requests, proxy BC API
You can see above that there are references to ‘MainController’.
That is where we’ll put the logic that handles the OAuth handshake and stores the credentials generated for the store.
Keep in mind this uses session based storage, so when the browser session expires, the app will stop working.

The last route is a proxy through to the BigCommerce v2 and v3 APIs. We’ll use that to enable a bc-api endpoint we can hit on the front-end, which helps us bypass CORS issues.

Create  `/app/Http/Controllers/MainController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

use GuzzleHttp\Exception\RequestException;

use GuzzleHttp\Client;

class MainController extends BaseController
{
    protected $baseURL;

    public function __construct()
    {
        $this->baseURL = env('APP_URL');
    }

    public function getAppClientId()
    {
        if (env('APP_ENV') === 'local') {
            return env('BC_LOCAL_CLIENT_ID');
        } else {
            return env('BC_APP_CLIENT_ID');
        }
    }

    public function getAppSecret(Request $request)
    {
        if (env('APP_ENV') === 'local') {
            return env('BC_LOCAL_SECRET');
        } else {
            return env('BC_APP_SECRET');
        }
    }

    public function getAccessToken(Request $request)
    {
        if (env('APP_ENV') === 'local') {
            return env('BC_LOCAL_ACCESS_TOKEN');
        } else {
            return $request->session()->get('access_token');
        }
    }

    public function getStoreHash(Request $request)
    {
        if (env('APP_ENV') === 'local') {
            return env('BC_LOCAL_STORE_HASH');
        } else {
            return $request->session()->get('store_hash');
        }
    }

    public function install(Request $request): RedirectResponse
    {
        // Make sure all required query params have been passed
        if (!$request->has('code') || !$request->has('scope') || !$request->has('context')) {
            return redirect()->action([MainController::class, 'error'], ['error_message' => 'Not enough information was passed to install this app.']);
        }

        try {
            $client = new Client();
            $result = $client->request('POST', 'https://login.bigcommerce.com/oauth2/token', [
                'json' => [
                    'client_id' => $this->getAppClientId(),
                    'client_secret' => $this->getAppSecret($request),
                    'redirect_uri' => $this->baseURL . '/auth/install',
                    'grant_type' => 'authorization_code',
                    'code' => $request->input('code'),
                    'scope' => $request->input('scope'),
                    'context' => $request->input('context'),
                ]
            ]);

            $statusCode = $result->getStatusCode();
            $data = json_decode($result->getBody(), true);

            if ($statusCode == 200) {
                $request->session()->put('store_hash', $data['context']);
                $request->session()->put('access_token', $data['access_token']);
                $request->session()->put('user_id', $data['user']['id']);
                $request->session()->put('user_email', $data['user']['email']);

                // If the merchant installed the app via an external link, redirect back to the 
                // BC installation success page for this app
                if ($request->has('external_install')) {
                    return Redirect::to('https://login.bigcommerce.com/app/' . $this->getAppClientId() . '/install/succeeded');
                }
            }

            return Redirect::to('/');
        } catch (RequestException $e) {
            $statusCode = $e->getResponse()->getStatusCode();
            $errorMessage = "An error occurred.";

            if ($e->hasResponse()) {
                if ($statusCode != 500) {
                    $errorMessage = $e->getResponse();
                }
            }

            // If the merchant installed the app via an external link, redirect back to the 
            // BC installation failure page for this app
            if ($request->has('external_install')) {
                return Redirect::to('https://login.bigcommerce.com/app/' . $this->getAppClientId() . '/install/failed');
            } else {
                return redirect()->action([MainController::class, 'error'], ['error_message' => $errorMessage]);
            }
        }
    }

    public function load(Request $request): RedirectResponse
    {
        $signedPayload = $request->input('signed_payload');
        if (!empty($signedPayload)) {
            $verifiedSignedRequestData = $this->verifySignedRequest($signedPayload, $request);
            if ($verifiedSignedRequestData !== null) {
                $request->session()->put('user_id', $verifiedSignedRequestData['user']['id']);
                $request->session()->put('user_email', $verifiedSignedRequestData['user']['email']);
                $request->session()->put('owner_id', $verifiedSignedRequestData['owner']['id']);
                $request->session()->put('owner_email', $verifiedSignedRequestData['owner']['email']);
                $request->session()->put('store_hash', $verifiedSignedRequestData['context']);
                
            } else {
                return redirect()->action([MainController::class, 'error'], ['error_message' => 'The signed request from BigCommerce could not be validated.']);
            }
        } else {
            return redirect()->action([MainController::class, 'error'], ['error_message' => 'The signed request from BigCommerce was empty.']);
        }

        $request->session()->regenerate();

        return Redirect::to('/');
    }

    public function error(Request $request)
    {
        $errorMessage = "Internal Application Error";

        if ($request->session()->has('error_message')) {
            $errorMessage = $request->session()->get('error_message');
        }

        echo '<h4>An issue has occurred:</h4> <p>' . $errorMessage . '</p> <a href="' . $this->baseURL . '">Go back to home</a>';
    }

    private function verifySignedRequest($signedRequest, $appRequest)
    {
        list($encodedData, $encodedSignature) = explode('.', $signedRequest, 2);

        // decode the data
        $signature = base64_decode($encodedSignature);
        $jsonStr = base64_decode($encodedData);
        $data = json_decode($jsonStr, true);

        // confirm the signature
        $expectedSignature = hash_hmac('sha256', $jsonStr, $this->getAppSecret($appRequest), $raw = false);
        if (!hash_equals($expectedSignature, $signature)) {
            error_log('Bad signed request from BigCommerce!');
            return null;
        }
        return $data;
    }

    public function makeBigCommerceAPIRequest(Request $request, $endpoint)
    {
        $requestConfig = [
            'headers' => [
                'X-Auth-Client' => $this->getAppClientId(),
                'X-Auth-Token'  => $this->getAccessToken($request),
                'Content-Type'  => 'application/json',
            ]
        ];

        if ($request->method() === 'PUT') {
            $requestConfig['body'] = $request->getContent();
        }

        $client = new Client();
        $result = $client->request($request->method(), 'https://api.bigcommerce.com/' . $this->getStoreHash($request) .'/'. $endpoint, $requestConfig);
        
        return $result;
    }

    public function proxyBigCommerceAPIRequest(Request $request, $endpoint)
    {
        if (strrpos($endpoint, 'v2') !== false) {
            // For v2 endpoints, add a .json to the end of each endpoint, to normalize against the v3 API standards
            $endpoint .= '.json';
        }

        $result = $this->makeBigCommerceAPIRequest($request, $endpoint);

        return response($result->getBody(), $result->getStatusCode())->header('Content-Type', 'application/json');
    }
}
```

---
**NOTE**

By default, your app is set to use your hardcoded API credentials in the .env file. 
When you install the app within BigCommerce, you want your app to use the credentials passed back during the OAuth token exchange. 
To do this, make sure your APP_ENV config value in your .env file is set to production, like so:

```bash
APP_ENV=production
```

---

Now, if you head to your BC store admin, to the Apps -> My Apps -> My Draft Apps section, you can install your app and see it successfully load inside the control panel.

![First Load](/assets/images/first-load.png)

## Step 3. Create a front-end experience that surfaces data in BigCommerce
All the pieces are in place to create front-end components that actually do something, so I created a simple set of React components and screens that:

- Load a brief catalog summary and store information
- List the last 10 orders and enable the user to cancel them

To enable the front-end components to hit the API using the back-end BigCommerce API Proxy endpoints in MainController.php, add the following files to a new `/resources/js/Services/` directory:

Create `/resources/js/Services/ApiServices.js`

```js
export const ApiService = {
    getOrders(params) {
        params = Object.assign({
            page: 1,
            limit: 10,
        }, params);

        return axios({
            method: 'get',
            url: '/bc-api/v2/orders',
            params,
        });
    },

    updateOrder(orderId, data) {
        return axios({
            method: 'put',
            url: `/bc-api/v2/orders/${orderId}`,
            data,
        });
    },

    deleteOrder(orderId) {
        return axios({
            method: 'delete',
            url: `/bc-api/v2/orders/${orderId}`,
        });
    },

    getResourceCollection(resource, params) {
        params = Object.assign({
            page: 1,
            limit: 10,
        }, params);

        return axios({
            method: 'get',
            url: `/bc-api/${resource}`,
            params,
        });
    },

    getResourceEntry(resource, params) {
        return axios({
            method: 'get',
            url: `/bc-api/${resource}`,
            params,
        });
    },

    updateResourceEntry(resource, data) {
        return axios({
            method: 'put',
            url: `/bc-api/${resource}`,
            data,
        });
    },

    deleteResourceEntry(resource, data) {
        return axios({
            method: 'delete',
            url: `/bc-api/${resource}`,
        });
    },
};
```

Create `/resources/js/Services/index.js`

```js
import { ApiService } from './ApiService';

export {
    ApiService,
};
```

Let's create two new components:

Create `/resources/js/components/Table.jsx` that will contain a basic Table component

```js
import React from 'react';

export default class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    getTableRow(data, index) {
        return (
            <tr key={index}>
                {this.props.tableHeaders.map(function (header, index) {
                    let value = data;
                    if (header.index) {
                        value = data[header.index];
                    }

                    if (header.callback) {
                        value = header.callback(value);
                    }

                    return <td className="px-4 py-4 whitespace-nowrap" key={index}>{value}</td>;
                })}
            </tr>
        );
    }

    render() {
        return (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                    <tr>{this.props.tableHeaders.map(function (header, index) {
                        return <th className="py-3.5 px-4 text-left" key={index}>{header.label}</th>;
                    })}</tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {this.props.tableData.map(this.getTableRow.bind(this))}
                </tbody>
            </table>
        );
    }
}
```

Create `/resources/js/components/Spinner.jsx` that will contain a basic Spinner component

```js
export default function Spinner() {
    return (
        <div className="text-center">
            <div className="m-5" role="status">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" /><circle cx="12" cy="2.5" r="1.5"><animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite" /></circle></svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}
```

Now, with the API service and components in place, the screens can be updated to produce something functional. To bring it all together, change the following files:

`/resources/js/Pages/Home.jsx`

```js
import Navigation from '@/Components/Navigation';
import Spinner from '@/Components/Spinner';
import { ApiService } from '@/Services';

import { Head } from '@inertiajs/react';
import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isCatalogSummaryLoading: true,
            isStoreInfoLoading: true,
            catalogSummary: {},
            storeInfo: {},
        };
    }

    componentDidMount() {
        ApiService.getResourceEntry('v2/store').then(this.handleStoreInfoResponse.bind(this));
        ApiService.getResourceEntry('v3/catalog/summary').then(this.handleCatalogSummaryResponse.bind(this));
    }

    handleStoreInfoResponse(response) {
        this.setState({
            isStoreInfoLoading: false,
            storeInfo: response.data,
        });
    }

    handleCatalogSummaryResponse(response) {
        this.setState({
            isCatalogSummaryLoading: false,
            catalogSummary: response.data.data,
        });
    }

    render() {
        const fieldsInSummary = [
            {
                label: "Variant Count",
                index: "variant_count",
                format: "number",
            },
            {
                label: "Inventory Count",
                index: "variant_count",
                format: "number",
            },
            {
                label: "Inventory Value",
                index: "inventory_value",
                format: "currency",
            },
        ];
        return (
            <>
                <Head title="Home" />
                <Navigation />
                <div className="container mx-auto p-5">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="content col-span-3 grid-col-3 rounded bg-gray-100 shadow-lg p-4">
                            <h2 className="text-xl font-bold mb-6">This is the Home Page.</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {fieldsInSummary.map(function (summaryItem, index) {
                                    return <div className="max-w-sm rounded overflow-hidden shadow-lg px-6 py-4 bg-white" key={index}>
                                        <h3 className="font-bold text-xl mb-2">
                                            {summaryItem.label}
                                        </h3>
                                        {
                                            this.state.isStoreInfoLoading
                                                ?
                                                <Spinner />
                                                :
                                                <span className="text-gray-700 text-base">
                                                    {
                                                        summaryItem.format === 'currency'
                                                            ?
                                                            new Intl.NumberFormat(undefined, { style: 'currency', currency: this.state.storeInfo.currency }).format(this.state.catalogSummary[summaryItem.index])
                                                            :
                                                            this.state.catalogSummary[summaryItem.index]
                                                
                                                    }
                                                </span>
                                        }
                                    </div>;
                                }.bind(this))}
                            </div>
                        </div>
                        <div className="sidebar rounded bg-gray-100 shadow-lg p-4">
                            <h2 className="text-xl font-bold mb-6">This is a Side Bar.</h2>
                            {
                                this.state.isStoreInfoLoading
                                    ?
                                    <Spinner />
                                    :
                                    <section>
                                        {
                                            this.state.storeInfo.logo.url
                                                ?
                                                <img src={this.state.storeInfo.logo.url} className="img-fluid img-thumbnail rounded" />
                                                :
                                                <h5>{this.state.storeInfo.name}</h5>
                                        }

                                        <ul>
                                            <li className="flex flex-row justify-between mb-1">
                                                <h3 className="font-bold">Domain:</h3>
                                                <p className="">{this.state.storeInfo.domain}</p>
                                            </li>
                                            <li className="flex flex-row justify-between mb-1">
                                                <h3 className="font-bold">Secure URL:</h3>
                                                <p className="">{this.state.storeInfo.secure_url}</p>
                                            </li>
                                        </ul>

                                    </section>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
```

`/resources/js/Pages/List.jsx`

```js
import Navigation from '@/Components/Navigation';
import Spinner from '@/Components/Spinner';
import Table from '@/Components/Table';
import { ApiService } from '@/Services';

import { Head } from '@inertiajs/react';
import React from 'react';

export default class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOrdersLoading: true,
            orders: {
                data: [],
                pagination: {},
            },
            tableHeaders:
                [
                    {
                        label: "Order ID",
                        index: "id",
                        callback: function (orderId) {
                            return orderId;
                        },
                    },
                    {
                        label: "Billing Name",
                        index: "billing_address",
                        callback: function (billingAddress) {
                            return `${billingAddress.first_name} ${billingAddress.last_name}`;
                        },
                    },
                    {
                        label: "Order Total",
                        index: "total_inc_tax",
                        callback: function (orderTotal) {
                            return orderTotal;
                        },
                    },
                    {
                        label: "Order Status",
                        callback: function (data) {
                            let badgeClass = 'badge badge-';
                            if (data.status_id === 5) {
                                badgeClass += 'danger';
                            } else if (data.status_id === 2 || data.status_id === 10) {
                                badgeClass += 'success';
                            } else {
                                badgeClass += 'light';
                            }

                            return (
                                <span className={badgeClass}>{data.status}</span>
                            );
                        },
                    },
                    {
                        label: "Actions",
                        callback: function (data) {
                            if (data.status_id !== 5) {
                                return (
                                    <button type="button" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={(e) => this.cancelOrder(data.id, e)}>Cancel</button>
                                );
                            }
                        }.bind(this),
                    },
                ],
        };
    }

    componentWillMount() {
        this.loadOrders();
    }

    loadOrders() {
        ApiService.getOrders({
            limit: 5
        }).then(this.handleOrdersResponse.bind(this));
    }

    handleOrdersResponse(response) {
        this.setState({
            isOrdersLoading: false,
            orders: {
                data: response.data
            }
        });
    }

    cancelOrder(orderId) {
        const newOrderData = { status_id: 5 };

        this.setState({
            isOrdersLoading: true,
        });

        ApiService.updateOrder(orderId, newOrderData)
            .then(this.loadOrders.bind(this));
    }

    hasOrders() {
        return (this.state.orders.data.length > 0);
    }

    render() {
        return (
           <>
                <Head title="Order List" />
                <Navigation />
                <div className="container mx-auto p-5">
                    <div className="content col-span-3 grid-col-3 rounded bg-gray-100 shadow-lg p-4">
                        <h2 className="text-xl font-bold mb-6">List of Orders</h2>
                            {
                                this.state.isOrdersLoading
                                    ?
                                    <Spinner />
                                    :
                                    this.hasOrders()
                                        ?
                                        <section>
                                            <Table tableHeaders={this.state.tableHeaders} tableData={this.state.orders.data} />
                                        </section>
                                        :
                                        <section>
                                            <div className="emptyTable">No orders exist yet!</div>
                                        </section>
                            }
                    </div>
                </div>
            </>
        );
    }
}
```

![Home](/assets/images/Home.png)

![List](/assets/images/List.png)

## Next Steps

If you got this far, congrats! You have a great base to work on as you experiment with all the BigCommerce APIs.

To launch a real app, aside from hosting it on a server other than your dev box. 
You’ll still need to add some persistent storage for API credentials, storing the store and user info received from the OAuth token request during app install so users can load the app after the initial session expires. 
Error handling, especially for failed requests to the API, should be handled and surfaced to the merchant.
Adding tests once you get to a state you are reasonably happy with, to help keep regressions at bay.
