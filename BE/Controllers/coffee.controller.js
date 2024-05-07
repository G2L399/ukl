const { where } = require("sequelize");
/** load model for `members` table */
const FlagsModel = require(`../models/index`).coffee;
const order_list = require("../models/index").order_list;
const order_detail = require("../models/index").order_detail;

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op;
/** create function for read all data */
const multer = require(`multer`);
const storage = multer.memoryStorage(); // Store files in memory (you can configure it to store in disk)
const upload = multer({ storage: storage });

exports.GetFlags = async (request, response) => {
  /** call findAll() to get all data */
  let Flags = await FlagsModel.findAll({
    // attributes: { exclude: ["image"] },
  });
  return response.json({
    success: true,
    data: Flags,
    message: `All Members have been loaded`,
  });
};

exports.GetOneFlags = async (request, response) => {
  /** call findAll() to get all data */
  let Flags = await FlagsModel.findOne({
    where: {
      id: request.params.id,
    },
    // attributes: { exclude: ["image"] },
  });
  return response.json({
    success: true,
    data: Flags,
    message: `One Members have been loaded`,
  });
};

exports.insert = async (request, response) => {
  try {
    const { name, size, price } = request.body;

    // Access the uploaded file from request.file.buffer
    const image = request.file;
    console.log(image.originalname);
    // Insert data into the 'coffee' table
    const newCoffee = await FlagsModel.create({
      name: name,
      size: size,
      price: price,
      image: image.buffer, // Save the file buffer to the 'image' column
      ImageName: image.originalname, //
    });

    return response
      .status(201)
      .json({ message: "Coffee added successfully", coffee: newCoffee });
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
};
exports.update = async (request, response) => {
  try {
    const id = request.params.id;

    // Check if a record with the given name already exists
    let existingCoffee = await FlagsModel.findOne({ where: { id: id } });

    if (existingCoffee) {
      // If the record exists, update it

      const { name, size, price } = request.body;
      let updatedFields = {};

      if (name) updatedFields.name = name;
      if (size) updatedFields.size = size;
      if (price) updatedFields.price = price;
      if (request.file) {
        updatedFields.image = request.file.buffer;
        updatedFields.ImageName = request.file.originalname;
      }

      await FlagsModel.update(updatedFields, { where: { id: id } });
      const updated = await FlagsModel.findOne({
        where: { id: id },
        attributes: { exclude: ["image"] },
      });

      return response.status(200).json({
        status: true,
        data: updated,
        message: "Coffee updated successfully",
      });
    } else {
      return response.status(404).json({ message: "Coffee not found" });
    }
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
};
exports.delete = async (request, response) => {
  try {
    const coffeeId = request.params.id;

    // Find the coffee record to be deleted
    const coffeeToDelete = await FlagsModel.findByPk(coffeeId);

    if (!coffeeToDelete) {
      return response
        .status(404)
        .json({ status: false, message: "Coffee not found" });
    }

    // Delete the coffee record
    await coffeeToDelete.destroy();

    return response.status(200).json({
      status: true,
      data: {
        id: coffeeToDelete.id,
        name: coffeeToDelete.name,
        size: coffeeToDelete.size,
        price: coffeeToDelete.price,
        ImageName: coffeeToDelete.ImageName,
        createdAt: coffeeToDelete.createdAt,
        updatedAt: coffeeToDelete.updatedAt,
      },
      message: "Coffee has been deleted",
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
exports.createOrderList = async (request, response) => {
  try {
    let total1 = 0;
    const {
      customer_name,
      order_type,
      order_date,
      order_detail: orderDetails,
    } = request.body;
    for (const total of orderDetails) {
      total1 += total.price * total.quantity;
    }
    // Create order list
    const newOrderList = await order_list.create({
      customer_name: customer_name,
      order_type: order_type,
      order_date: order_date,
      total_price: total1,
    });

    // Create order details
    for (const orderItem of orderDetails) {
      await order_detail.create({
        order_id: newOrderList.id,
        coffee_id: orderItem.coffee_id,
        price: orderItem.price * orderItem.quantity,
        quantity: orderItem.quantity,
      });
    }

    return response.status(201).json({
      status: true,
      data: {
        id: newOrderList.id,
        customer_name: newOrderList.customer_name,
        order_type: newOrderList.order_type,
        order_date: newOrderList.order_date,
        createdAt: newOrderList.createdAt,
        updatedAt: newOrderList.updatedAt,
      },
      message: "Order list has been created",
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
exports.getOrderLists = async (request, response) => {
  try {
    // Fetch order lists with associated order details
    const orderLists = await order_list.findAll({
      include: [
        {
          model: order_detail,
          as: "orderID",
        },
      ],
    });

    return response.status(200).json({
      status: true,
      data: orderLists,
      message: "Order list has been retrieved",
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};
