import React from "react";

const StoreFrontFooter = () => {
    return (
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Product Catalog Powered by <a href="https://paymeo.co" className="text-blue-400 hover:underline">Paymeo</a>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
}

export default StoreFrontFooter;