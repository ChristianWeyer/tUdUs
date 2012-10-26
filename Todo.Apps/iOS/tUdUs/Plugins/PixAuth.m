//
// PixAuth.m
// phoneGap1
//
// Created by Aaron saunders on 8/25/10.
// Copyright 2010 clearlyINNOVATIVE. All rights reserved.
// Modified 2011 by briankiel.

#import "PixAuth.h"

@implementation PixAuth

-(void) loginWithBadCert:(NSMutableArray*)params withDict:(NSMutableDictionary*)options {
    // modified this script from its original version, as the new version of phonegap.exec passes the arguments starting at index 1
    // index 0 contains the plugin.method being called.
    NSLog(@"in loginWithBadCert. url is: %@", [params objectAtIndex:1]);
    NSURL *serverURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@",[params objectAtIndex:1]]];
    NSLog(@"url is: %@", serverURL);
    
    NSURLRequest *connectionRequest = [NSURLRequest requestWithURL:serverURL
                                                       cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60.0];
    NSURLConnection * aConnection = [[NSURLConnection alloc] initWithRequest:connectionRequest delegate:self];
    connectionData = [[NSMutableData alloc] init];
}

/* NSURLConnection Delegate Methods */

- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
    NSLog(@"in didReceiveResponse ");
    [connectionResponse release];
    connectionResponse = [response retain];
    [connectionData setLength:0];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    NSLog(@"in didReceiveData ");
    [connectionData appendData:data];
}

//
// this method, and the one below get the magic rolling and allow my ajax request
// to function as expected, even with the bogus certificate
//
- (BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace {
    return YES;
}

//
// my application requires credentials, so they are stored in the application settings
//
- (void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    NSLog(@"in didReceiveAuthenticationChallange ");
    
    NSURLCredential *newCredential;
    newCredential = [NSURLCredential credentialWithUser:[[NSUserDefaults standardUserDefaults] stringForKey:@"emailAddress"]
                                               password:[[NSUserDefaults standardUserDefaults] stringForKey:@"password"]
                                            persistence:NSURLCredentialPersistenceNone];
    [[challenge sender] useCredential:newCredential
           forAuthenticationChallenge:challenge];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
    NSLog(@"in connectionDidFinishLoading ");
    NSString *string = [[[NSString alloc] initWithData:connectionData encoding:NSUTF8StringEncoding] autorelease];
    NSLog(@"%@", string);
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
    NSLog(@"in didFailWithError ");
    NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
}

- (NSCachedURLResponse *)connection:(NSURLConnection *)connection willCacheResponse:(NSCachedURLResponse *)cachedResponse {
    return nil; // Never cache
}

@end