/* eslint-disable no-unused-vars */
const router = require("express").Router();

const {
  Op,
  models: { User, Agent, Transaction, Client, TC, Partner, Property },
} = require("../db");

const {
  requireToken,
  isAgentOfUser,
  isTransactionOfAgent,
} = require("./middleware");

/**
 * GET /
 * All transactions for all Agents owned by logged in User
 */
router.get("/", requireToken, async (req, res, next) => {
  try {
    res.json(
      await User.findByPk(req.user.id, {
        include: [{ model: Agent, include: [Transaction] }],
      }).then(({ agents }) =>
        agents.reduce(
          (transactions, agent) => [...transactions, ...agent.transactions],
          []
        )
      )
    );
  } catch (err) {
    next(err);
  }
});

/**
 * POST /:agentId
 * Create Transaction for User with Agent Id
 * Include propertyId key in body to automatically add property to Transaction
 */
router.post(
  "/:agentId",
  requireToken,
  isAgentOfUser,
  async (req, res, next) => {
    try {
      const transaction = await Transaction.create(req.body);

      const agent = await Agent.findByPk(req.agentId);

      await agent.addTransaction(transaction);

      res.json(transaction);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /clients/:agentId
 * Create Transaction for User with Agent Id and Alos include Client information
 * Include propertyId key in body to automatically add property to Transaction
 */
router.post(
  "/clients/:agentId",
  requireToken,
  isAgentOfUser,
  async (req, res, next) => {
    try {
      const { transactionDetails, clientDetails } = req.body;
      const transaction = await Transaction.create(transactionDetails);

      const client = await Client.create(clientDetails);
      const agent = await Agent.findByPk(req.agentId);

      await agent.addClient(client);
      await agent.addTransaction(transaction);
      await client.addTransaction(transaction);

      res.json(
        await Transaction.findByPk(transaction.id, {
          include: [Client, Property],
        })
      );
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /:agentId/:transactionId
 * Update Transaction for User with Agent Id and Transaction Id
 */
router.put(
  "/:agentId/:transactionId",
  requireToken,
  isAgentOfUser,
  isTransactionOfAgent,
  async (req, res, next) => {
    try {
      const transaction = await Transaction.update(req.body, {
        where: { id: req.transactionId },
        returning: true,
      });

      const [numUpdated, updatedTransaction] = transaction;
      res.json(updatedTransaction[0]);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /:agentId/:transactionId?parties=[clientId, tcId, partnerId]=ID
 * Add parties to the transaction
 * Include clientId, tcId, and/or partnerId in the query string in order to add a specific party to the transaction
 */
router.put(
  "/:agentId/:transactionId/parties",
  requireToken,
  isAgentOfUser,
  isTransactionOfAgent,
  async (req, res, next) => {
    try {
      const transaction = await Transaction.findByPk(req.transactionId);
      if ("clientId" in req.query) {
        await transaction.addClient(req.query.clientId);
      }
      if ("tcId" in req.query) {
        await transaction.addTc(req.query.tcId);
      }
      if ("partnerId" in req.query) {
        await transaction.addPartner(req.query.partnerId);
      }
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
