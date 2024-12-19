import fetch from 'node-fetch';

async function deleteProduct(productId) {
  if (!productId) {
    console.log("Product ID is missing");
    return;
  }

  try {
    const response = await fetch(`https://your-api-url/products/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log(`Product with ID ${productId} deleted successfully.`);
    } else {
      console.log(`Failed to delete product with ID ${productId}.`);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

const productId = 1;  // Replace with actual product ID
deleteProduct(productId);
