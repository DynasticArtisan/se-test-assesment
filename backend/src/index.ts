import mongoose from "mongoose";
import { createServer } from "@src/server";

const start = async () => {
    try {
        const server = await createServer();

        const gracefulShutdown = async (signal: string) => {
            console.log(`${signal} received. Shutting down gracefully...`);
            
            try {
                if (server) {
                    await server.stop();
                    console.log('Apollo Server stopped');
                }
                
                if (mongoose.connection.readyState !== 0) {
                    await mongoose.connection.close();
                    console.log('MongoDB connection closed');
                }
                
                console.log('Shutdown completed');
                process.exit(0);
            
            } catch (error) {
                console.error('Error during shutdown:', error);
                process.exit(1);
            }
        };
    
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
    
        process.on('unhandledRejection', (error) => {
            console.error('Unhandled Rejection:', error);
            gracefulShutdown('UNHANDLED_REJECTION');
        });
    
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error);
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });
    
    } catch (error) {
        console.error('Failed to start application:', error);
        
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        
        process.exit(1);
    }
};
  
start();